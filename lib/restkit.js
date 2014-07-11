Database = require(__dirname+'/Database.js');
Database.setup(__dirname+'/../models', 'behive2', 'root', 'root', { 'host' : 'localhost' }); //TODO: Move Config

var Lingo   = require('lingo')
var Async   = require('async')

/**
 * RestKit constructor
 *
 * @param options
 * @constructor
 */
var Restkit = function (options) { }

/**
 * Version
 *
 * @type array
 */
Restkit.prototype.version = 0.1;



Restkit.prototype.defaultStates = {

    "limit"  : 10,
    "offset" : 0,
    "search" : null,
    "search_type" : 'OR',
    "sort"   : "id",
    "order"  : "order",
    "columns" : ""


}

/**
 * Set State
 *
 * @param model
 * @param request
 * @param callback
 */
Restkit.prototype.setState = function(model, request, callback) {

    var model_state = model.options.state

    Async.forEach(Object.keys(Restkit.prototype.defaultStates), function (state, next) {

        // If the state is in the request use that, else fallback to model definition
        if(request.query.state) {
            model.state[state] = request.query.state
        }else if(model_state[state]){
            model.state[state] = model_state[state]
        }else{
            model.state[state] = Restkit.prototype.defaultStates[state]
        }

        next();

    }, function () {

        // Loop through any other model definition states
        Async.forEach(Object.keys(model_state), function (state, next) {

            

            next();

        }, function () {


        });

    });

    console.log(model)


    model.state = [];

    model.state.limit       = request.query.limit  ? request.query.limit  : model_state.limit  ? model_state.limit : 100
    model.state.offset      = request.query.offset ? request.query.offset : model_state.offset ? model_state.offset : 0
    model.state.search      = request.query.search ? request.query.search : model_state.search ? model_state.search : null
    model.state.sort        = request.query.sort   ? request.query.sort   : model_state.sort   ? model_state.sort : null
    model.state.order       = request.query.order  ? request.query.order  : model_state.order  ? model_state.order : null
    model.state.search_type = request.query.search_type ? request.query.search_type : model_state.search_type ? model_state.search_type : null
    model.state.columns     = request.query.columns     ? request.query.columns     : model_state.columns     ? model_state.columns : null

    callback()

}

/**
 * Fetch resources from database
 *
 * @param request
 * @param response
 */
Restkit.prototype.fetchResources = function(request, response) {

    var resource_name = request.params.resource, english = Lingo.en

    if(english.isPlural(resource_name)) {

        var model = Database.model(resource_name)

        console.log(model)

        if(model) {

            Async.series([
                function(callback) { Restkit.prototype.setState(model, request, callback) },
                function(callback) {
                        model.findAndCountAll(model.state).success(function(result) {

                            var payload = {};

                            Async.forEach(Object.keys(model.state), function (param, next) {

                                response.header(param, model.state[param])
                                payload[param] = model.state[param]
                                next();

                            }, function () {

                                payload.count = result.rows.length
                                payload.total = result.count
                                payload[resource_name] = result.rows

                                response.send(payload)

                                var util = require('util')
                                console.log(util.inspect(process.memoryUsage()))

                            });
                        })
                    }
                ]);
        }else{
            Restkit.prototype.notFound('NoDefinition', response)
        }
    }else{
        Restkit.prototype.badRequest('InflectionSingular', response)
    }

}


/**
 * Get a resource
 *
 * @param request
 * @param response
 * @param next
 */
Restkit.prototype.fetchResource = function(request, response, next) {

    var resource_name = request.params.resource,
        identifer = request.params.identifer,
        english = Lingo.en,
        model = Database.model(Lingo.capitalize(english.pluralize(resource_name)));

    if(model) {

        model.find(identifer).success(function(result) {

            payload.count = result.rows.length
            payload.total = result.count
            payload[resource_name] = result.rows

            response.send(payload)

        })
    }
}

/**
 * Setup default routes
 *
 * @param callback
 */
Restkit.prototype.attachResourceRoutes = function(server, callback) {

    // Otherwise fall back to standard database lookups
    server.get('/:resource/',           Restkit.prototype.fetchResources)
    server.get('/:resource/:identifer', Restkit.prototype.fetchResource)
    callback()

}

/**
 * Start the server
 */
Restkit.prototype.attach = function(server) {

    console.log('ATTACHING RESTKIT (VERSION '+this.version+')....')

    Async.series([

        function(callback) {
            Restkit.prototype.attachResourceRoutes(server, callback)
        },
        function(callback) {
            console.log('RESTKIT SUCCESSFULLY ATTACHED TO %s SERVER %s', server.name, server.url)
            console.log('Please start server using server.listen() in your entry file.')
            callback()
        }
    ]);

}


// Error Responses - ** BORING STUFF **
/**
 * Bad Request Response
 *
 * @param type
 * @param response
 */
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

/**
 * Note Found Response
 *
 * @param type
 * @param response
 */
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