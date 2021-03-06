const pkg = require('../../package'),
  core = require('gengojs-core'),
  pack = require('gengojs-default-pack');
export default (function() {
  'use strict';
  /**
   * Global scope
   * @private
   */
  var global;

  function hapi(plugin, options, next) {
    plugin.ext('onPreHandler', function(request, reply) {
      global.ship.bind(global)(request);
      reply.continue();
    });
    plugin.ext('onPreResponse', function(request, reply) {
      global.ship.bind(global)(request);
      reply.continue();
    });
    next();
  }

  var gengo = function(options, plugins = {}) {
    global = core(options, plugins, pack());
    var register = hapi;
    register.attributes = {
      name: pkg.name
    };
    return {
      register: register,
      options: options || {}
    };
  };
  /**
   * @method clone
   * @description Returns the API.
   * @return {Function} The API.
   * @public
   */
  gengo.clone = function() {
    return global.assign.apply(global, arguments);
  };
  /**
   * version.
   * @type {String}
   * @public
   */
  gengo.version = pkg.version;
  // Export
  return gengo;
})();