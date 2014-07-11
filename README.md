# Restkit

Higher-level Rapid development API framework with Database ORM and self building routes.
Built on-top of Restify + Sequaliz to add database layer and best-practise schema.

Schema based on research and recommendations for best practise REST API implementation.

- http://www.youtube.com/watch?v=hdSrT4yjS1g
- http://www.youtube.com/watch?v=ITmcAGvfcJI
- http://www.youtube.com/watch?v=HW9wWZHWhnI
- http://www.vinaysahni.com/best-practices-for-a-pragmatic-restful-api
- http://www.restapitutorial.com/

## Changelog

Thursday 10th July

*0.0.0 - 0.0.1*

- Initial version - Automatic routing, basic error responses, basic schema
- Added custom routes utility function

## Example Usage

```
var Restkit  = require('restkit');

Restkit = new Restkit();

// Add a new custom route
Restkit.addRoute('GET /hello', function(request, response) { response.send({'message' : 'Hello world'}) })

// Start the server
Restkit.start();

```

## Todo

- Add self-defining model builder
- Add HMATEOAS Elements to response
- Add "envelope" parameter
- Add "head" options
- Add default getResource (GET)
- Add default createResource (POST)
- Add default updateResource (PUT)
- Add default deleteResource (DELETE)
- Add vendor headers
- Move Model definitions and database config into parent project
- Add Database layer for Mongo


## License

Apache License 2.0 - http://www.apache.org/licenses/LICENSE-2.0.html

