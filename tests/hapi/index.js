var Hapi = require('hapi');
var server = new Hapi.Server();
var gengo = require('../../hapi/');
var path = require('path');
server.connection({
    port: 3000
});

var options = {
    engines: {
        jade: require('jade')
    },
    path: __dirname + '/',
    compileOptions: {
        pretty: true
    }

};

server.views(options);

server.register(gengo({
    directory: './tests/locales',
    supported: ['ja', 'en-US']
}), function(err) {
    if (err) console.log('an error occurred');
});


server.route({
    method: 'GET',
    path: '/',
    handler: function(request, reply) {
        reply.view('index', {
            title: 'My home page'
        });
    }
});



server.start(function() {
    console.log('Server running at:', server.info.uri);
});
