/*jslint node: true, forin: true, jslint white: true, newcap: true*/
/*global console*/
/*
 * genogjs utils
 * author : Takeshi Iwana
 * https://github.com/iwatakeshi
 * license : MIT
 * Code heavily borrowed from Adam Draper
 * https://github.com/adamwdraper
 */

(function() {
  'use strict';

  var utils,
    _ = require('underscore'),
    colors = require('colors'),
    hasModule = (typeof module !== 'undefined' && module.exports),
    configure,
    levels = {
      silly: 'rainbow',
      input: 'grey',
      verbose: 'cyan',
      prompt: 'grey',
      info: 'green',
      data: 'grey',
      help: 'cyan',
      warn: 'yellow',
      debug: 'blue',
      error: 'red'
    };

  colors.setTheme(levels);

  utils = function(config) {
    if (config) {
      configure = config;
    }
  };

  utils.isDefined = function(value) {
    var valuetype = typeof value;
    switch (valuetype) {
      case "object":
        if (_.isNull(value) || _.isEmpty(value)) {
          return false;
        }
        return true;
      case "string":
        if (value === "" || value === "null") {
          return false;
        }
        return true;
      case "undefined":
        return false;
      default:
        return true;
    }
  };

  utils.debug = function(value) {
    //print function
    function cout(obj, message, level) {
      if (message) {
        if (level) {
          console.log(message[level]);
        } else {
          console.log(message);
        }

        if (!level) {
          console.log();
        }
      }
      if (!_.isArray(obj)) {
        switch (typeof obj) {
          case 'object':
            if (level) {
              console.log(JSON.stringify(obj, null, 2)[level]);
            } else {
              console.log(JSON.stringify(obj, null, 2));
            }
            break;
          default:
            if (level) {
              try {
                console.log(obj.toString()[level]);
              } catch (error) {
                console.log(obj);
              }
            } else {
              console.log(obj);
            }
        }
      } else {
        if (level) {
          console.log(obj.toString()[level]);
        } else {
          console.log(obj.toString());
        }
      }
    }

    function exists(level) {
      var result;
      if (_.isArray(configure().debug())) {
        _.each(configure().debug(), function(res) {
          if (level === res) {
            result = true;
          }
        });
      }

      return result;
    }
    //print function when there is only one
    function prettyprint(message, level) {
      switch (configure().debug()[0]) {
        case 'info':
          if (level === 'info') {
            cout(value, message, 'info');
          }
          break;
        case 'warn':
          if (level === 'warn') {
            cout(value, message, 'warn');
          }

          break;
        case 'error':
          if (level === 'error') {
            cout(value, message, 'error');
          }

          break;
        case 'data':
          if (level === 'data') {
            cout(value, message, 'data');
          }

          break;
        case 'debug':
          if (level === 'debug') {
            cout(value, message, 'debug');
          }

          break;
      }
    }


    return {
      info: function(message) {
        switch (typeof configure().debug()) {
          case 'boolean':
            if (configure().debug()) {
              cout(value, message);
            }
            break;
          case 'object':
            if (configure().debug().length > 1) {
              if (exists('info')) {
                cout(value, message, 'info');
              }
            } else {
              prettyprint(message, 'info');
            }
            break;
        }
      },
      warn: function(message) {
        switch (typeof configure().debug()) {
          case 'boolean':
            if (configure().debug()) {
              cout(value, message);
            }
            break;
          case 'object':
            if (configure().debug().length > 1) {
              if (exists('warn')) {
                cout(value, message, 'warn');
              }
            } else {
              prettyprint(message, 'warn');
            }
            break;
        }
      },
      error: function(message) {
        switch (typeof configure().debug()) {
          case 'boolean':
            if (configure().debug()) {
              cout(value, message);
            }
            break;
          case 'object':
            if (configure().debug().length > 1) {
              if (exists('error')) {
                cout(value, message, 'error');
              }
            } else {
              prettyprint(message, 'error');
            }
            break;
        }
      },
      data: function(message) {
        switch (typeof configure().debug()) {
          case 'boolean':
            if (configure().debug()) {
              cout(value, message);
            }
            break;
          case 'object':
            if (configure().debug().length > 1) {
              if (exists('data')) {
                cout(value, message, 'data');
              }
            } else {
              prettyprint(message, 'data');
            }
            break;
        }
      },
      debug: function(message) {
        switch (typeof configure().debug()) {
          case 'boolean':
            if (configure().debug()) {
              cout(value, message);
            }
            break;
          case 'object':
            if (configure().debug().length > 1) {
              if (exists('data')) {
                cout(value, message, 'debug');
              }
            } else {
              prettyprint(message, 'debug');
            }
            break;
        }
      }
    };
  };


  /*
   * @description Checks if the string has dot notation or is just a regular string.
   * Thanks to Barmar! :)
   * http://stackoverflow.com/a/25799425/1251031
   */

  utils.regex = function(str) {
    var patterns = {
      dot: {
        //self: /^([a-z\.]*)/g (buggy)
      },
      bracket: {
        dot: new RegExp(/^\[([a-z\.]+)\]\.([a-z\.]+)/),
        phrase: new RegExp(/^\[([\s\S]+)\]\.([a-z\.]+)/),
        phrase2: new RegExp(/^\[(.*)\]/),
        brackdot: new RegExp(/^\[([a-z\.]+)\]\.([a-z\.]+)/),
        brackdot2: new RegExp(/^\[([a-z\.]+)\]/)
      },
      mustache: new RegExp(/{{.*}}/),
      sprintf: new RegExp(/%/),
      locale: new RegExp(/^[a-z]{2}(?:-([a-z]{2,4}))?/)
    };
    var Dot = function() {
      var _isDot = false;
      //http://stackoverflow.com/a/25799425/1251031
      if (str.match(/\.[^.]/) && !str.match(/\s/)) {
        _isDot = true;
      }

      return {
        exec: function() {
          if (_isDot) {
            return str;
          }
        },
        match: function() {
          return _isDot;
        }
      };
    };

    var Bracket = function() {
      var _isDot = false,
        _isPhrase = false,
        _isBrackdot = false;

      if (patterns.bracket.dot.test(str)) {
        _isDot = true;
      }

      if (patterns.bracket.phrase.test(str) || patterns.bracket.phrase2.test(str)) {
        _isPhrase = true;
      }
      if (patterns.bracket.brackdot.test(str) || patterns.bracket.brackdot2.test(str)) {
        _isBrackdot = true;
      }

      return {
        exec: function() {
          if (_isDot) {

            return patterns.bracket.dot.exec(str);
          } else if (_isPhrase) {

            return patterns.bracket.phrase.exec(str) || patterns.bracket.phrase2.exec(str);
          } else if (_isBrackdot) {
            return patterns.bracket.brackdot.exec(str) || patterns.bracket.brackdot2.exec(str);
          }
        },
        match: function() {
          return _isDot || _isPhrase || _isBrackdot;
        }
      };

    };

    var Mustache = function() {
      var _isMustache = false;
      if (patterns.mustache.test(str)) {
        _isMustache = true;
      }
      return {
        match: function() {
          return _isMustache;
        }
      };
    };

    var Sprintf = function() {
      var _isSprintf = false;
      if (patterns.sprintf.test(str)) {
        _isSprintf = true;
      }
      return {
        match: function() {
          return _isSprintf;
        }
      };
    };

    var Locale = function() {
      var _isLocale = false;
      if (patterns.locale.test(str)) {
        _isLocale = true;
      }
      return {
        match: function() {
          return _isLocale;
        },
        exec: function() {
          if (_isLocale) {
            return patterns.locale.exec(str);
          }
        },
        toUpperCase: function() {
          var templocale = "";
          var _result = patterns.locale.exec(str);
          if (_result[1]) {
            templocale = str.replace(_result[1], _result[1].toUpperCase());
            return templocale;
          } else {
            return str;
          }
        }
      };

    };
    return {
      Dot: Dot,
      Bracket: Bracket,
      Mustache: Mustache,
      Sprintf: Sprintf,
      Locale: Locale
    };

  };

  /*
   * @description Checks if the string contains sprintf functions like %s %d
   */
  utils.isSprintf = function(str) {
    if (str.match(/%(?:\d+\$)?[+-]?(?:[ 0]|'.{1})?-?\d*(?:\.\d+)?[bcdeEufFgGosxX]/)) {
      return true;
    } else {
      return false;
    }
  };

  utils.isWholeNumber = function(num) {
    if (_.isNumber(num)) {
      num = Math.abs(num);
      if (num % 1 === 0) {
        return true;
      } else {
        return false;
      }
    }
  };
  utils.Object = function(object) {
    return {
      //http://stackoverflow.com/a/21170391/1251031
      toArray: function() {
        function deepToArray(obj) {
          var copy = [];

          if (obj.constructor == Object ||
            obj.constructor == Array) {

            _.forEach(obj, proc);

          } else {

            copy = obj;

          }


          function proc(current, index, collection) {

            var processed = null;
            if (current.constructor != Object &&
              current.constructor != Array) {
              processed = current;
            } else {
              processed = deepToArray(_.toArray(current));
            }

            copy.push(processed);

          }

          return copy;
        }

        return deepToArray(object);
      },
      extend: function(dest) {
        Object.extender = function(destination, source) {
          var property;
          for (property in source) { // loop through the objects properties
            if (_.isObject(source[property])) {
              // if this is an object
              destination[property] = destination[property] || {};
              Object.extender(destination[property], source[property]); // recursively deep extend
            } else {
              destination[property] = source[property]; // otherwise just copy
            }
          }
          return destination;
        };

        return Object.extender(dest, object);
      },
      size: function() {
        Object.size = function(obj) {
          var size = 0,
            key;
          for (key in obj) {
            if (obj.hasOwnProperty(key)) {
              size++;
            }
          }

          return size;
        };
        return Object.size(object);
      }
    };
  };

  utils.Array = function(array) {
    return {
      //http://stackoverflow.com/a/4215753/1251031
      toObject: function() {
        var obj = array.reduce(function(o, v, i) {
          o[i] = v;
          return o;
        }, {});
        return obj;
      },
      //http://stackoverflow.com/a/12469043/1251031
      remove: function(index, clean) {
        delete array[index];
        if (clean) {
          var arr1 = array,
            arr2 = [];
          for (var a in arr1) {
            if (arr1[a] && arr1.hasOwnProperty(a)) {
              arr2.push(arr1[a]);
            }
          }
          array.splice(0);
          for (var b in arr2) {
            if (arr2.hasOwnProperty(b)) {
              array.push(arr2[b]);
            }
          }
          return array;
        } else {
          return array;
        }
      }
    };
  };
  /************************************
        Exposing Core
    ************************************/

  // CommonJS module is defined
  if (hasModule) {
    module.exports = utils;
  }

  /*global ender:false */
  if (typeof ender === 'undefined') {
    // here, `this` means `window` in the browser, or `global` on the server
    // add `utils` as a global object via a string identifier,
    // for Closure Compiler 'advanced' mode
    this.utils = utils;
  }

  /*global define:false */
  if (typeof define === 'function' && define.amd) {
    define([], function() {
      return utils;
    });
  }
}).call(this);
