/*jslint node: true, forin: true, jslint white: true, newcap: true, curly: false*/

/**
 * Takeshi Iwana aka iwatakeshi
 * MIT 2015
 * config.js
 * This module sets the user's settings
 */

'use strict';
var _ = require('lodash');
var utils = require('./utils/');
var root = require('app-root-path').path;
var path = require('path');
var S = require('string');
var yaml = require('js-yaml');
var fs = require('fs-extra');
// hack
if (S(root).contains('\\plugins\\config')) root = root.replace('\\plugins\\config', '');
var settings = path.normalize(root + '/settings/');

/**
 * @constructor Config
 * @public
 */
function Config(options) {
  /**
   * @method set
   * @description Sets the settings.
   * @param {Object} options The options to set.
   * @public
   */
  this.set = function(options) {
    var result;
    this.settings = {};
    //todo: simplify this to /settings/ (have it guess whether its json or yml)
    if (_.isString(options)) result = this._read(options);
    else {
      result = this._read(settings);
    }
    this.settings = _.assign(this.settings, result);
    if (_.isPlainObject(options)) this.settings = _.assign(this.settings, options);
  };
  /**
   * @method detect
   * @description Returns the detect settings.
   * @return {Object} The detect settings.
   * @public
   */
  this.detect = function() {
    return this.settings.detect;
  };
  /**
   * @method key
   * @description Returns the keys settings.
   * @return {Object} The keys settings.
   * @public
   */
  this.keys = function() {
    return this.settings.keys;
  };
  /**
   * @method configuration
   * @description Returns the entire settings.
   * @return {Object} The settings.
   * @public
   */
  this.configuration = function() {
    return this.settings;
  };
  /**
   * @method globalID
   * @description Returns the global ID.
   * @return {String} The global ID.
   * @public
   */
  this.globalID = function() {
    return this.settings.global;
  };
  /**
   * @method localizeID
   * @description Returns the localize ID.
   * @return {String} The localize ID.
   * @public
   */
  this.localizeID = function() {
    return this.settings.localize;
  };
  /**
   * @method directory
   * @description Returns the path to the locales.
   * @return {Object} The path to locales.
   * @public
   */
  this.directory = function() {
    var dir = this.settings.directory;
    // http://nodejs.org/docs/latest/api/path.html#path_path_isabsolute_path
    if (!utils.isAbsolute(dir)) {
      // ./x-dir ?
      if (S(dir).include('./')) dir = dir.replace('.', '');
      dir = path.normalize(path.join(root, dir));
    } else {
      // /x-dir?
      if (!S(dir).include(root)) dir = path.normalize(path.join(root, dir));
    }
    this.settings.directory = this._filterPath(dir);
    return this.settings.directory;
  };
  /**
   * @method supported
   * @description Returns the supported locales.
   * @return {Array} The supported locales.
   * @public
   */
  this.supported = function() {
    var supported = this.settings.supported;
    var result = [];
    // if supporting a single locale
    if (_.isString(supported)) result.push(supported);
    // then it must be an array
    else result = supported;
    // normalize each locale
    _.forEach(result, function(item, index) {
      result[index] = utils.normalize(item);
    });
    this.settings.supported = result;
    return this.settings.supported;
  };
  /**
   * @method default
   * @description Returns the default locale.
   * @return {String} The default locale.
   * @public
   */
  this.default = function() {
    return utils.normalize(this.settings.default);
  };
  /**
   * @method isRouter
   * @description Checks if the router is enabled.
   * @return {Boolean} The validity of router.
   * @public
   */
  this.isRouter = function() {
    return this.settings.router;
  };
  /**
   * @method isMarkdown
   * @description Checks if markdown is enabled.
   * @return {Boolean} The validity of markdown.
   * @public
   */
  this.isMarkdown = function() {
    return this.settings.markdown;
  };
  this.isCache = function() {
    return this.settings.cache;
  };
  /**
   * @method extension
   * @description Returns the dictionary's extension.
   * @return {String} The dictionary's extension.
   * @public
   */
  this.extension = function() {
    return '.' + utils.normalize(this.settings.extension).replace('.', '').replace('yaml', 'yml');
  };
  /**
   * @method keywords
   * @description Returns the keywords for the dictionary.
   * @return {Object} The keywords for the dictionary.
   * @public
   */
  this.keywords = function() {
    var keywords = this.settings.keywords;
    this.settings.keywords = _.defaults(keywords || {}, {
      default: 'default',
      translated: 'translated',
      global: 'global',
      plural: 'plural',
    });
    return this.settings.keywords;
  };
  /**
   * @method prefix
   * @description Returns the dictionary's prefix.
   * @return {String} The dictionary's prefix.
   * @public
   */
  this.prefix = function() {
    return this.settings.prefix;
  };
  /**
   * @method template
   * @description Returns the template settings.
   * @return {Object} The template settings.
   * @public
   */
  this.template = function() {
    var template = this.settings.template;
    this.settings.template = _.defaults(template || {}, {
      open: '{{',
      close: '}}'
    });
    return this.settings.template;
  };
  /**
   * @method _read
   * @description Reads the external configuration file.
   * @param  {String} filepath The path to the settings.
   * @private
   */
  this._read = function(filepath) {
    if (S(filepath).include('.json')) return require(path.normalize(filepath));
    else if (S(filepath).include('.yaml') || S(filepath).include('yml')) return yaml.safeLoad(fs.readFileSync(path.normalize(filepath), 'utf8'));
    else if (S(filepath).include('settings')) {
      var settings;
      try {
        settings = yaml.safeLoad(fs.readFileSync(path.normalize(filepath + 'index.yml'), 'utf8'))
      } catch (e) {

      } finally {
        settings = require(path.normalize(filepath + 'index.json'))
      }
      return settings;
    } else throw new Error('The configuration must be a JSON or a YAML file.');
  };
  /**
   * @method _filterPath
   * @description Appends '/' or '\\' if missing.
   * @param  {String} str The path to the filter.
   * @private
   */
  this._filterPath = function(str) {
    //str = path.normalize(str);
    if (str && !(/\//).test(str.slice(-1)) && (/\//).test(str)) str = str + '/';
    else if (str && !(/\\/).test(str.slice(-1)) && (/\\/).test(str)) str = str + '\\';
    return str;
  };

   this.set(options);
}

//export
function config() {
  this.settings = new Config(this.options);
  return this.settings;
};


module.exports = function() {
  var register = config;
  register.package = require('./package');
  //for tests
  register.clone = function() {
    return Config;
  }
  return register;
};