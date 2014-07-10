Database = require(__dirname+'/Database.js');
Database.setup(__dirname+'/../models', 'behive2', 'root', 'root', {}); //TODO: Move Config

var Restify = require('restify')
var Lingo   = require('lingo')
var Async   = require('async')

/**
 Main module class.

 @param {String} version Restkit Version.

 @example

 // without params
 var restkit = new Restkit()

 @class Restkit
 @constructor
 */

var Restkit = function (test) { }

Restkit.prototype.version = 0.1;

Restkit.prototype.fetchResources = function(request, response) {

    var resource_name = request.params.resource;

    var Model = Database.model(Lingo.capitalize(resource_name));

    if(Model) {

        Model.state = [];
        Model.state.limit  = request.query.limit  ? request.query.limit : 100
        Model.state.offset = request.query.offset ? request.query.offset : 0

        Model.findAndCountAll( Model.state ).success(function(result) {

            var payload = {};

            Async.forEach(Object.keys(Model.state), function (param, next) {

                response.header(param, Model.state[param])
                payload[param] = Model.state[param]

                next();

            }, function (err) {

                payload.count = result.rows.length
                payload.total = result.count
                payload[resource_name] = result.rows

                response.send(payload)

                var util = require('util')
                console.log(util.inspect(process.memoryUsage()))

            });


        })

    }else{

        Restkit.prototype.notFound('NoDefinition', response)

    }

}

Restkit.prototype.routePlural = function(request, response, next) {

    var english = Lingo.en
    var resource_name = request.params.resource

    if(english.isPlural(resource_name)) {

        // Becuase this is a callback inside restify, this ends up referencing the
        // restify object, to solve access via prototype call.
        Restkit.prototype.fetchResources(request, response)

    }else{

        Restkit.prototype.badRequest('InflectionSingular', response)

    }
}

Restkit.prototype.routeSingle = function(req, res, next) {

    console.log('single')

}

Restkit.prototype.start = function() {

    console.log('STARTING RESTKIT (VERSION '+this.version+')')

    server = Restify.createServer().use(Restify.queryParser());

    // Otherwise fall back to standard database lookups
    server.get('/:resource/',    this.routePlural)
    server.get('/:resource/:id', this.routeSingle)


    // TODO: call in series using Async, put server.listen back in here
    // TODO: create system for adding custom routes elsewhere (Restkit.addRoute(route, callback)
//        this.registerCustomerRoutes(server)


    server.listen(3000, function() {

        console.log('%s listening at %s', server.name, server.url)
    });

}


// Error Responses - ** BORING STUFF **
Restkit.prototype.badRequest = function(type, response) {

    var result = {}

    result.status = 400;
    result.error = "Bad request."
    result.devMessage = "The requested resource could not be retrieved due to a problem with the request."

    switch(type) {

        case 'InflectionSingular' :

            result.devMessage =
                result.devMessage +
                "A singular resource was requested but no unique was identifier provided. " +
                "For singular resource requests you must used the URL format /:resource/:identifer." +
                "If you intended to access a resource set, use a pluralised word instead of a singular one."

        case 'InflectionPlural' :

            result.devMessage =
                result.devMessage +
                "A resource set was requested but a singular resource name was used. " +
                "For resource set requests you must used the URL format /:resource and use a plural resource name"

    }

    result.userMessage =  "There was a problem accessing the item you requested. Please support if you require help with this issue."

    response.send(result)

}

// Error Responses - ** BORING STUFF **
Restkit.prototype.notFound = function(type, response) {

    var result = {}

    result.status = 404;
    result.error = "Bad request."
    result.devMessage = "No resource available at the specified URL. This is either due to an incorrect resource name in the request, or no records exist."

    switch(type) {

        case 'NoDefinition' :

            result.devMessage =
                result.devMessage +  "There is NO resource definition (model) for the resource you requested in the database layer. "

    }

    result.userMessage =  "Ooops, We couldn't find the item you requested. Please support if you require help with this issue."

    response.send(result)

}

module.exports = Restkit