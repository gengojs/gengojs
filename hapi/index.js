(function() {
  'use strict';
  var
    version = require('../package').version,
    core = require('gengojs-core');

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


  var gengo = function(options, plugins) {
    global = core(options, plugins);
    var register = hapi;
    register.attributes = {
      name: require('../package').name
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
  gengo.version = version;

  module.exports = gengo;

  /*global ender:false */
  if (typeof ender === 'undefined') {
    /**
     * @type {Gengo}
     * @private
     */
    this.gengo = gengo;
  }

  /*global define:false */
  if (typeof define === 'function' && define.amd) {
    define([], function() {
      return gengo;
    });
  }
}).call(this);
