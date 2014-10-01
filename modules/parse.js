/*jslint node: true, forin: true, jslint white: true, newcap: true*/
/*global console*/
/*
 * parse
 * author : Takeshi Iwana
 * https://github.com/iwatakeshi
 * license : MIT
 * Code heavily borrowed from Adam Draper
 * https://github.com/adamwdraper
 */
(function() {
  'use strict';

  var parse,
    hasModule = (typeof module !== 'undefined' && module.exports),
    _ = require('underscore'),
    loader = require('./loader.js'),
    config = require('./config.js'),
    utils = require('./utils.js'),
    isDefined = utils.isDefined,
    router = require('./router.js'),
    localemap = require('../maps/locales.js'),
    regex = utils.regex,
    debug = utils.debug;

  //normal parser for phrases
  parse = function(phrase, locale, plural) {
    var result, routeResult, universeResult;
    //check if we have to override
    if (isOverride(locale)) {
      //the load a new instance of loader with the json loaded
      //to the overrided locale
      result = new loader(locale.locale).json();
    } else {
      result = loader(locale).json();
    }
    var _result;
    if (config().router()) {
      if (router().route().length() === 0) {
        if (result) {
          _result = result[router().route().dot()][phrase];
          if (_result) {
            routeResult = resultParser(result[router().route().dot()][phrase], locale, plural);
          } else if (result[config().keywords().universe][phrase]) {
            universeResult = resultParser(result[config().keywords().universe][phrase], locale, plural);
          } else {
            return phrase;
          }
        } else {
          return phrase
        }

      } else {
        //check if the definition contains the route
        _result = dotParser(router().route().dot(), result);
        //if it does
        if (_result) {
          // do something
          routeResult = resultParser(dotParser(router().route().dot(), result)[phrase], locale, plural);
          //else lets try universe
        } else {
          _result = dotParser(router().route().dot(), result);
          //if universe exists
          if (_result) {
            universeResult = resultParser(result[config().keywords().universe][phrase], locale, plural);
          } else {
            return phrase;
          }
        }
      }
      //if result still has trouble
      if (!routeResult) {
        //try universe
        if (universeResult) {
          routeResult = universeResult;
        }
      }
      if (isDefault(locale) && !plural) {
        return phrase;
      } else {
        return routeResult || phrase;
      }
    } else {
      if (result) {
        return resultParser(result[phrase], locale, plural) || phrase;
      } else {
        return phrase;
      }
    }
  };

  /*
    @param {RegEx Array} input
    @param {String} locale
    @param {Boolean} plural
    */
  //bracket handler
  parse.bracket = function(input, locale, plural) {
    var search, dot, result, routeResult, universeResult, results;
    try {
      if (input[1]) {
        search = input[1];
        debug(search).debug("module parse, fn: bracket, Parse Bracket search");
      }
      if (input[2]) {
        dot = input[2];
        debug(dot).debug("module parse, fn: bracket, Parse Bracket dot");
        if (dot.indexOf('plural') > -1) {
          //prevents the word plural to clash with an existing 'plural' ie plural.plural
          plural = false;
        }
      }
      if (isOverride(locale)) {
        result = new loader(locale.locale).json();
      } else {
        result = loader(locale).json();
      }
      if (result) {
        if (config().router()) {
          if (router().route().length() === 0) {
            routeResult = result[router().route().dot()];
            universeResult = result[config().keywords().universe];
          } else {
            routeResult = dotParser(router().route().dot(), result);
            universeResult = result[config().keywords().universe];
          }
        } else {
          result = result[search];
        }
        if (dot) {
          if (regex(dot).Dot().match()) {
            //then the dot is 'dot.dot.dot'
            results = {
              first: function() {
                if (!config.router()) {
                  var _result = resultParser(dotParser(dot, result), locale, plural);
                  if (!_result) {
                    if (result[search]) {
                      return result[search];
                    }
                  } else {
                    return _result;
                  }
                }
              },
              second: function() {
                if (config().router()) {
                  var _result = resultParser(dotParser(dot, routeResult), locale, plural);
                  if (!_result) {
                    if (routeResult[search]) {
                      return routeResult[search];
                    }
                  } else {
                    return _result;
                  }
                }
              },
              third: function() {
                if (config().router()) {
                  try {
                    var _result = resultParser(dotParser(dot, universeResult), locale, plural);
                    if (!_result) {
                      if (universeResult[search]) {
                        return universeResult[search];
                      }
                    } else {
                      return _result;
                    }
                  } catch (error) {

                  }
                }
              }
            };

            _.each(results, function(key) {
              var value = key();
              if (isDefined(value)) {
                result = value;
              }
            });
          } else {
            //then theres only one dot
            results = {
              first: function() {
                if (!config().router()) {
                  var _result = resultParser(result[dot], locale, plural);
                  if (!_result) {
                    if (result[search]) {
                      return result[search];
                    }
                  } else {
                    return _result;
                  }
                }
              },
              second: function() {
                if (config().router()) {
                  var _result = resultParser(routeResult[dot], locale, plural) || resultParser(routeResult[search][dot], locale, plural);
                  if (!_result) {
                    if (routeResult[search]) {
                      return routeResult[search];
                    }
                  } else {
                    return _result;
                  }
                }
              },
              third: function() {
                if (config().router()) {
                  try {
                    var _result = resultParser(universeResult[dot], locale, plural) || resultParser(universeResult[search][dot], locale, plural);

                    if (!_result) {
                      if (universeResult[search]) {
                        return universeResult[search];
                      }
                    } else {
                      return _result;
                    }
                  } catch (error) {

                  }
                }
              }
            };
            _.each(results, function(key) {
              var value = key();
              if (value) {
                result = value;
              }
            });
          }
        } else {
          results = {
            first: function() {
              if (!config().router()) {
                var _result = resultParser(result, locale, plural);

                if (!_result) {
                  if (result[search]) {
                    return result[search];
                  }
                } else {
                  return _result;
                }
              }
            },
            second: function() {
              if (config().router()) {
                var _result = resultParser(routeResult, locale, plural) || resultParser(routeResult[search], locale, plural);
                if (!_result) {
                  if (routeResult[search]) {
                    //try again
                    return routeResult[search];
                  }
                } else {
                  return _result;
                }
              }
            },
            third: function() {
              if (config().router()) {
                var _result = resultParser(universeResult, locale, plural) || resultParser(universeResult[search], locale, plural);
                if (!_result) {
                  if (universeResult[search]) {
                    return universeResult[search];
                  }
                } else {
                  return _result;
                }
              }
            }
          };
          _.each(results, function(key) {
            var value = key();
            if (value) {
              result = value;
            }
          });
        }
      } else {
        return result || search
      }

      return result || search;
    } catch (error) {
      debug("module: parse fn: bracket, " + error.toString().replace("Error: ", " ")).error();
    }
  };

  parse.dot = function(input, locale, plural) {
    var search = input;
    if (search.indexOf('plural') > -1) {
      //prevents the word plural to clash with an existing 'plural' ie plural.plural
      plural = false;
    }
    debug(search).debug("module parse, fn: bracket, Parse Bracket search");
    var result, routeResult, universeResult, results;
    if (isOverride(locale)) {
      result = new loader(locale.locale).json();
    } else {
      result = loader(locale).json();
    }
    if (config().router()) {
      if (router().route().length() === 0) {
        routeResult = result[router().route().dot()];
        universeResult = result[config().keywords().universe];
      } else {
        routeResult = dotParser(router().route().dot(), result);
        universeResult = result[config().keywords().universe];
      }
    }
    if (result) {
      results = {
        first: function() {
          if (!config().router()) {
            return resultParser(dotParser(search, result), locale, plural);
          }
        },
        second: function() {
          if (config().router()) {
            var _dotresult = dotParser(search, routeResult) || dotParser(search, universeResult);
            if (_dotresult) {
              var _result = resultParser(_dotresult, locale, plural);
              if (_result) {
                return _result;
              }
            }
          }
        }
      };
      var _result;
      _.each(results, function(key) {
        var value = key();
        if (value) {
          _result = value;
        }
      });
    } else {
      return undefined;
    }
    return _result;
  };
  //https://github.com/rhalff/dot-object/blob/master/index.js
  function dotParser(path, obj) {
    var i, keys, val;
    if (path.indexOf('.') !== -1) {
      keys = path.split('.');
      for (i = 0; i < keys.length; i++) {
        if (keys[i].indexOf("*") !== -1) {
          keys[i] = keys[i].replace('*', '.');
        }
        if (obj) {
          if (obj.hasOwnProperty(keys[i])) {
            if (i === (keys.length - 1)) {
              return obj[keys[i]];
            } else {
              obj = obj[keys[i]];
            }
          } else {
            debug("module: parse, fn: dotParser,  Type Cannot read property " + keys[i] + " of undefined").warn();
            if (config().router()) {
              debug("Could be universe?").warn();
            }
            return undefined;
          }
        } else {
          return undefined;
        }
      }
      return obj;
    } else {
      return obj[path];
    }
  }

  function resultParser(result, locale, plural) {
    var _result;
    try {
      if (_.isString(result)) {
        return result;
      } else if (_.isObject(result)) {
        if (isDefault(locale)) {
          //check if the keyword 'default' exist in the object
          if (result.hasOwnProperty(config().keywords().default)) {
            if (plural) {
              _result = result[config().keywords().plural][config().keywords().default];
            } else {
              _result = result[config().keywords().default];
            }
            if (!_result) {
              if (plural) {
                _result = result[config().keywords().plural];
              } else {
                _result = undefined;
              }
            }
            return _result;
          } else {
            //then try
            if (plural) {
              return result[config().keywords().plural];
            }
          }
        } else {
          //check if the keyword 'translated' exist in the object
          if (result.hasOwnProperty(config().keywords().translated)) {
            if (plural) {
              _result = result[config().keywords().plural][config().keywords().translated];
            } else {
              _result = result[config().keywords().translated];
            }
            if (!_result) {
              if (plural) {
                _result = result[config().keywords().plural];
              } else {
                //we tried so return undefined
                _result = undefined;
              }
            }
            return _result;
          } else {
            //then try
            if (plural) {
              return result[config().keywords().plural];
            }
          }
        }
      }
    } catch (error) {
      debug("module: parse fn: resultParser, " + error.toString().replace("Error: ", " ")).error();
    }
  }

  function isDefault(input) {
    if (localemap.gengo[input] === config().default().toString()) {
      return true;
    } else {
      return false;
    }
  }

  function isOverride(input) {
    if (_.isObject(input)) {
      if (input.override) {
        return input.override;
      } else {
        return false;
      }
    } else {
      return false;
    }
  }

  /************************************
        Exposing parse
    ************************************/

  // CommonJS module is defined
  if (hasModule) {
    module.exports = parse;
  }

  /*global ender:false */
  if (typeof ender === 'undefined') {
    // here, `this` means `window` in the browser, or `global` on the server
    // add `parse` as a global object via a string identifier,
    // for Closure Compiler 'advanced' mode
    this.parse = parse;
  }

  /*global define:false */
  if (typeof define === 'function' && define.amd) {
    define([], function() {
      return parse;
    });
  }
}).call(this);
