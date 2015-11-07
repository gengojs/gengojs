const version = require('../../package').version,
  core = require('gengojs-core'),
  pack = require('gengojs-default-pack');
export default (function() {
  'use strict';
  /**
   * Global scope
   * @private
   */
  var global;
  /**
   * @method gengo
   * @description Main function for Gengo.
   * @param  {Object} options The configuration options.
   * @return {Function}   The middleware for express.
   * @public
   */
  var gengo = function gengo(options, plugins = {}) {
    global = core(options, plugins, pack());
    return function(self, next) {
      global.ship.bind(global)(self);
      return next();
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
   * version
   * @type {String}
   * @public
   */
  gengo.version = version;
  // Export
  return gengo;
})();