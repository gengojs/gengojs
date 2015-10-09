'use strict';

Object.defineProperty(exports, '__esModule', {
  value: true
});

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

var _package = require('../../package');

var _gengojsCore = require('gengojs-core');

var _gengojsCore2 = _interopRequireDefault(_gengojsCore);

var _gengojsDefaultPack = require('gengojs-default-pack');

var _gengojsDefaultPack2 = _interopRequireDefault(_gengojsDefaultPack);

exports['default'] = (function () {
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
  var gengo = function gengo(options) {
    var plugins = arguments.length <= 1 || arguments[1] === undefined ? {} : arguments[1];

    global = (0, _gengojsCore2['default'])(options, plugins, (0, _gengojsDefaultPack2['default'])());
    return global.ship.bind(global);
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
   * version.
   * @type {String}
   * @public
   */
  gengo.version = _package.version;
  // Export
  return gengo;
})();

module.exports = exports['default'];
//# sourceMappingURL=../source maps/express/index.js.map
