
var Hives = Reskit.Database.model("Hives");

function getHives(req, res, next) {

    var limit  = req.query.limit ? req.query.limit : 100
    var offset = req.query.limit ? req.query.limit : 0

    res.header('limit',  limit)
    res.header('offset', offset)


    Hives.findAll({ 'limit' : limit }).success(function(hives) {

        var response = new Object();

        response.limit  = limit
        response.offset = offset
        response.items  = hives

        res.send(response)

        var util = require('util');

        console.log(util.inspect(process.memoryUsage()))

    })

}

function getHive(req, res, next) {

    var response = new Object()

    // Assert that ID has been provided
    if(!req.params.id) {

        response.status = 400;
        response.error = "No unique identifier provided. Resource cannot be retrieved."
        res.send(response)

    }

    var state = { id : req.params.id }


    Hives.find(state.id).success(function(hive) {

        if(!hive) {

            response.status = 404;
            response.error = "No resource found."
            res.send(response)

        }

        response.id   = state.id
        response.item = hive

        setHeaders(state, res)

        res.send(response)

    })

}

var forEach = function (array, callback, scope) {
    for (var i = 0; i < array.length; i++) {
        callback.call(scope, i, array[i]); // passes back stuff we need
    }
};


function setHeaders(state, res) {

    forEach(state, function (param, value) {
        res.header(param,  value)
        console.header(param,  value)
    });

    var util = require('util');

    res.header('process_memory_usage',  util.inspect(process.memoryUsage()))
    res.header('Access-Control-Allow-Origin', '*')

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
 * Create server
 *
 * @param callback
 */
Restkit.prototype.createServer = function(callback) {
    server = Restify.createServer().use(Restify.queryParser())
    callback()
}

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
 * Routes
 *
 * @type array
 */
Restkit.prototype.routes = []


