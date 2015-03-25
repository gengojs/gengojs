/*jslint node: true, forin: true, jslint white: true, newcap: true, curly: false*/
(function() {
  "use strict";
  var root = require('app-root-path'),
    version = require(root + '/package').version,
    Gengo = require(root + '/lib/gengo/');

  function hapi(plugin, options, next) {
      plugin.ext('onPreHandler', function(request, reply) {
        scope.ship.bind(local || global)(request);
        reply.continue();
      });
      plugin.ext('onPreResponse', function(request, reply) {
        scope.ship.bind(local || global)(request);
        reply.continue();
      });
      next();
    }
    /**
     * @description Scope
     * @private
     */
  var global;

  var gengo = function(options, plugins) {
    global = Gengo.create(options, plugins);
    var register = hapi;
    register.attributes = {
      name: require(root + '/package').name
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
    return global.apply() || null;
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
