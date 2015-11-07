'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
var version = require('../../package').version,
    core = require('gengojs-core'),
    pack = require('gengojs-default-pack');

exports.default = (function () {
  'use strict'
  /**
   * Global scope
   * @private
   */
  ;
  var global;
  /**
   * @method gengo
   * @description Main function for Gengo.
   * @param  {Object} options The configuration options.
   * @return {Function}   The middleware for express.
   * @public
   */
  var gengo = function gengo(options) {
    var plugins = arguments.length <= 1 || arguments[1] === undefined ? {} : arguments[1];

    global = core(options, plugins, pack());
    return function (self, next) {
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
  gengo.clone = function () {
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
//# sourceMappingURL=../source maps/koa/index.js.map
