import {
  version
}
from '../../package';
import core from 'gengojs-core';
import pack from 'gengojs-default-pack';
import 'babel/polyfill';
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
    return function*(next) {
      global.ship.bind(global)(this);
      yield next;
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