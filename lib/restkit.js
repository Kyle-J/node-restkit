Database = require(__dirname+'/Database.js');
Database.setup(__dirname+'/../models', 'behive2', 'root', 'vodofx', { 'host' : 'localhost' }); //TODO: Move Config

var Restify = require('restify')
var Lingo   = require('lingo')
var Async   = require('async')

var Restkit = function (options) {

}

/**
 * Routes
 *
 * @type array
 */
Restkit.prototype.routes = []

/**
 * Version
 *
 * @type array
 */
Restkit.prototype.version = 0.1;

/**
 * Adds a new custom route to the routes stack
 *
 * @param route
 * @param callback
 */
Restkit.prototype.addRoute = function(route, callback) {
    this.routes[route] = callback
}

/**
 * Fetch resources from database
 *
 * @param request
 * @param response
 */
Restkit.prototype.fetchResources = function(request, response) {

    var resource_name = request.params.resource,
        model = Database.model(Lingo.capitalize(resource_name));

    if(model) {

        model.state = [];
        model.state.limit  = request.query.limit  ? request.query.limit : 100
        model.state.offset = request.query.offset ? request.query.offset : 0

        model.findAndCountAll( model.state ).success(function(result) {

            var payload = {};

            Async.forEach(Object.keys(model.state), function (param, next) {

                response.header(param, model.state[param])
                payload[param] = model.state[param]

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

/**
 * Handel Resource set route request
 *
 * @param request
 * @param response
 * @param next
 */
Restkit.prototype.getResources = function(request, response) {

    var english = Lingo.en, resource_name = request.params.resource

    if(english.isPlural(resource_name)) {
        Restkit.prototype.fetchResources(request, response)
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
Restkit.prototype.getResource = function(request, response, next) {

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
 * Create server
 *
 * @param callback
 */
Restkit.prototype.createServer = function(callback) {
    server = Restify.createServer().use(Restify.queryParser())
    callback()
}

/**
 * Setup custom routes
 *
 * @param callback
 */
Restkit.prototype.setCustomRoutes = function(callback) {

    Async.each(Object.keys(Restkit.prototype.routes), function(route, next) {

        var route_parts = route.split(' '), method = route_parts[0].toLowerCase()
        server[method](route_parts[1], Restkit.prototype.routes[route])
        next()

    })

    callback()
}

/**
 * Setup default routes
 *
 * @param callback
 */
Restkit.prototype.setDefaultRoutes = function(callback) {

    // Otherwise fall back to standard database lookups
    server.get('/:resource/',           Restkit.prototype.getResources)
    server.get('/:resource/:identifer', Restkit.prototype.getResource)

    callback()
}

/**
 * Start the server
 */
Restkit.prototype.start = function() {

    console.log('STARTING RESTKIT (VERSION '+this.version+')')

    Async.series([

        function(callback) {
            Restkit.prototype.createServer(callback)
        },
        function(callback) {
            Restkit.prototype.setCustomRoutes(callback)
        },
        function(callback) {
            Restkit.prototype.setDefaultRoutes(callback)
        },
        function(callback) {

            server.listen(3000, function() {
                console.log('%s listening at %s', server.name, server.url)
            });

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