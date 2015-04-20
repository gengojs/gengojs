var Hapi = require('hapi');
var server = new Hapi.Server();
var gengo = require('../../hapi/');
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
  backend: {
    directory: './tests/locales',
  },
  header: {
    supported: ['en-US', 'ja']
  }
}), function(err) {
  'use strict';
  if (err) console.log('an error occurred');
});


server.route({
  method: 'GET',
  path: '/',
  handler: function(request, reply) {
    'use strict';
    reply.view('index', {
      title: 'My home page'
    });
  }
});



server.start(function() {
  'use strict';
  console.log('Server running at:', server.info.uri);
});