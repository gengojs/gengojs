/*jslint node: true, forin: true, jslint white: true, newcap: true*/
/*global console*/
/*
 * config.js
 * author : Takeshi Iwana
 * license : MIT
 * Code heavily borrowed from Adam Draper
 */

(function() {
  'use strict';

  /************************************
      Helpers
  ************************************/
  //noramlizes the locales to lowercase and a dash
  function normalize(locale) {
      var str = locale.toLowerCase();
      if (str.indexOf('_') > -1) {
        str = str.replace('_', '-');
      }
      return str;
    }
    //configures cout for debugging purposes
  function debug(obj) {
      //configure cout
      if (_.isPlainObject(obj)) {
        cout.config(configs.debug);
      } else {
        cout.config({
          cout: obj
        });
      }

    }
    /************************************
        Constants & Variables
    ************************************/

  var config,
    // check for nodeJS
    hasModule = (typeof module !== 'undefined' && module.exports),
    path = require('path'),
    defaults = {
      //set global variables
      global: {
        gengo: "__"
      },
      //set path to locale
      directory: path.normalize(require('app-root-path') + '/locales/'),
      //set to false
      debug: false,
      //supported locales
      supported: ['en-US'],
      //set default locale, which would be the locale used for your template of choice
      default: 'en-US',
      //set view aware
      router: false,
      //disable markdown
      markdown:false,
      //set file extension
      extension: 'js',
      //set cookie
      cookie: 'locale',
      //set keywords
      keywords: {
        default: 'default',
        translated: 'translated',
        universe: 'gengo',
        plural: 'plural'
      },
      prefix: ""
    },
    configs = defaults,
    //node modules
    _ = require('lodash'),
    cout = require('cout');

  /************************************
      Top Level Functions
  ************************************/

  config = function(opt) {
    configs = _.assign(_.extend(defaults, opt));
    debug(configs.debug);
    return {
      global: function() {
        return {
          gengo: function() {
            return configs.global.gengo;
          }
        };
      },
      directory: function() {
        var root = require('app-root-path'),
          sep = path.sep || '/',
          defaultPath = path.normalize(root + '/locales/'),
          tempPath = configs.directory;


        //if user doesn't want a root appended
        //for some reason
        if (_.isPlainObject(configs.directory)) {
          if (configs.directory.path) {
            if (configs.directory.path[configs.directory.path.length - 1] !== sep) {
              configs.directory.path += sep;
            }
            return path.normalize(configs.directory.path);
          }
        } else {
          //if it's a different path compared to the default then change it and sanitize it
          if (tempPath.indexOf(defaultPath) === -1) {
            tempPath = tempPath.split(path.sep).join().replace(/\,/g, sep);

            if (tempPath[0] !== sep) {
              tempPath = sep + tempPath;
            }

            if (tempPath[tempPath.length - 1] !== sep) {
              tempPath += sep;
            }
            tempPath = root + tempPath;
          }
          return path.normalize(tempPath);
        }


      },
      supported: function() {
        var supported = configs.supported.map(function(item) {
          return normalize(item);
        });
        return supported;
      },
      default: function() {
        return normalize(configs.default);
      },
      cookie: function() {
        return normalize(configs.cookie);
      },
      router: function() {
        return configs.router;
      },
      markdown: function (){
        return configs.markdown;
      },
      extension: function() {
        return configs.extension;
      },
      keywords: function() {
        return {
          default: function() {
            return configs.keywords.default;
          },
          translated: function() {
            return configs.keywords.translated;
          },
          universe: function() {
            return configs.keywords.universe;
          },
          plural: function() {
            return configs.keywords.plural;
          }
        };
      },
      prefix: function() {
        return configs.prefix.toString();
      }
    };
  };

  /************************************
      Exposing config
  ************************************/

  // CommonJS module is defined
  if (hasModule) {
    module.exports = config;
  }

  /*global ender:false */
  if (typeof ender === 'undefined') {
    // here, `this` means `window` in the browser, or `global` on the server
    // add `config` as a global object via a string identifier,
    // for Closure Compiler 'advanced' mode
    this.config = config;
  }

  /*global define:false */
  if (typeof define === 'function' && define.amd) {
    define([], function() {
      return config;
    });
  }
}).call(this);