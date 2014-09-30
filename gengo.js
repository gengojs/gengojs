/*jslint node: true, forin: true, jslint white: true, newcap: true*/
/*global console*/
/*
 * gengojs
 * version : 0.3.32
 * author : Takeshi Iwana aka iwatakeshi
 * https://github.com/iwatakeshi
 * license : MIT
 * Code heavily borrowed from :
 *        Adam Draper
 * https://github.com/adamwdraper
 *            &
 *      Marcus Spiegel
 * https://github.com/mashpie
 */

(function() {
  "use strict";
  //main functions
  var gengo,
    core,
    locale,
    lib,
    VERSION = '0.3.32',
    //gengo modules
    config = require('./modules/config.js'),
    router = require('./modules/router.js'),
    markdown = require('./modules/markdown.js'),
    parse = {
      phrase: require('./modules/parse.js'),
      bracket: require('./modules/parse.js').bracket,
      dot: require('./modules/parse.js').dot
    },
    //npm modules
    moment = require('moment'),
    numeral = require('numeral'),
    mustache = require('mustache'),
    kawari = require('kawari'),
    _ = require('underscore'),
    //utilities
    utils = require('./modules/utils.js'),
    regex = utils.regex,
    isDefined = utils.isDefined,
    debug = utils.debug,
    //variables
    bestmatch,
    requested = [],
    localemap = require('./maps/locales.js'),
    langmap = require('./maps/langs.js'),
    loader = require('./modules/loader.js'),
    hasModule = (typeof module !== 'undefined' && module.exports);

  /************************************
        Top Level Functions
    ************************************/
  //gengo
  gengo = function(phrase) {
    var values = {},
      args = [];
    //Credits to @mashpie for the idea
    //store everything in args when argumnets > 1
    //also ignore the first argument
    var array = Array.prototype.slice.call(arguments, 1);
    if (array.length > 1) {
      _.each(array, function(item) {
        args.push(item);
      });
      values = {};
    } else if (array.length === 1) {
      //for some reason, you must check if its an array first
      if (_.isArray(array[0])) {
        values = {};
        args = array[0];
      } else if (_.isObject(array[0])) {
        values = array[0];
        args = [];
      } else {
        values = {};
        args.push(array[0]);
      }
    }
    //let core do the hard work!
    return core(phrase, values, args);
  };
  /*
   * @description Returns a moment function
   * @param {Object, String}
   * The object can only contain the locale {locale: 'en'}.
   * This function can take 1 - 3 arguments, see momentjs.com for api
   */
  gengo.moment = function() {
    var _moment, args = [],
      _locale;
    if (arguments.length === 1) {
      var arg = arguments[0];
      if (_.isObject(arg)) {
        if (arg.locale) {
          _locale = localemap.moment[arg.locale];
        }
      } else if (_.isString(arg)) {
        arg.push(arg);
      }
    } else {
      _.each(arguments, function(key) {
        if (_.isString(key)) {
          if (localemap.moment[key]) {
            _locale = key;
          } else {
            args.push(key);
          }
        } else if (_.isObject(key)) {
          if (localemap.moment[key.locale]) {
            _locale = key.locale;
          }
        }
      });
    }

    if (_locale) {
      _moment = lib().moment(_locale);
    } else {
      _moment = lib(locale().bestmatch()).moment();
    }
    switch (args.length) {
      case 0:
        return _moment();
      case 1:
        return _moment(args[0]);
      case 2:

        return _moment(args[0], args[1]);
      case 3:
        return _moment(args[0], args[1], args[2]);
      case 4:
        return _moment(args[0], args[1], args[2], args[3]);
    }
  };
  /*
   * @description Returns a numeral function
   * @param {Object, String}
   * The object can only contain the locale {locale: 'en'}.
   * This function can take 1 - 2 arguments, see numeraljs.com for api
   */
  gengo.numeral = function() {
    var _numeral, args = [],
      _locale, self;
    if (arguments.length === 1) {
      var arg = arguments[0];
      if (_.isObject(arg)) {
        if (arg.locale) {
          _locale = localemap.numeral[arg.locale];
        }
        if (arg.self) {
          if (_.isBoolean(arg.self)) {
            self = arg.self;
          }
        }
      } else if (_.isNumber(arg)) {
        args.push(arg);
      }
    } else {
      _.each(arguments, function(key) {
        if (_.isNumber(key)) {
          args.push(key);
        } else if (_.isString(key)) {
          if (localemap.numeral[key]) {
            _locale = key;
          } else if (!isNaN(key)) {
            args.push(key);
          }
        } else if (_.isObject(key)) {
          if (localemap.numeral[key.locale]) {
            _locale = key.locale;
          }
        }
      });
    }
    if (_locale) {
      _numeral = lib().numeral(_locale);
    } else {
      _numeral = lib(locale().bestmatch()).numeral();
    }
    switch (args.length) {
      case 0:
        if (self) {
          //known issue when figuring out the language of numeral
          //_numeral.langauge() = error. still works without knowing
          //language
          return _numeral;
        } else {
          return _numeral();

        }
        break;
      case 1:
        return _numeral(args[0]);
    }
  };
  //configuration
  gengo.config = function(configuration) {
    config(configuration);
    //to prevent require from looping, pass a reference
    //of config to utils
    utils(config);
  };
  //initalize gengo
  gengo.init = function(req, res, next) {
    res.locals[config().global().gengo()] = gengo;
    req[config().global().gengo()] = gengo;
    req['setLocale'] = gengo.setLocale;
    req['getLocale'] = gengo.getLocale;
    locale(req);
    router().init(req);
    if (_.isFunction(next) && isDefined(next)) {
      return next();
    }
  };
  //expose the langauge
  gengo.language = function() {
    return langmap[localemap.gengo[locale().bestmatch()]];
  };
  //expose setLocale
  //this will set the locale globally
  gengo.setLocale = function(obj, locale) {
    var target = obj,
      req;
    // called like setLocale(req, 'en')
    if (obj && _.isString(locale)) {
      req = obj;
      target = localemap.gengo[locale];
    }

    // called like req.setLocale('en')
    if (locale === undefined && _.isString(this.locale) && _.isString(obj)) {
      req = this;
      target = localemap.gengo[obj];
    }

    //if the locale exists
    if (loader(localemap.gengo[locale])) {

      // called like setLocale('en')
      if (req === undefined) {
        bestmatch = localemap.gengo[target];
      } else {
        bestmatch = target;
        req.locale = localemap.gengo[target];
      }
    } else {
      if ((req !== undefined)) {
        req.locale = config().default();
      }
    }

    return gengo.getLocale(req);
  };
  //expose getLocale
  //returns the locale
  gengo.getLocale = function(req) {
    // called like getlocale(req)
    if (req && req.locale) {
      return req.locale;
    }

    // called like req.getlocale()
    if (req === undefined && typeof this.locale === 'string') {
      return this.locale;
    }
    // called like getlocale()
    return bestmatch || config().default();
  }
  //expose the version
  gengo.version = VERSION;

  //core takes care of the nitty gritty stuff
  //since we have separated the inputs into three parts
  //we can easily organize our tasks
  core = function(phrase, value, args) {

    debug("module, core, fn: core, Input").info();
    debug(phrase).info();
    debug(value).info();
    debug(args).info();

    //decides which locale to use
    function negotiate(override) {
      //override is used when its explicitly called
      //so if is defined
      if (override) {
        //check that its a string
        if (_.isString(override)) {
          //check if the string contains a locale
          if (override) {
            return {
              locale: localemap.gengo[override],
              override: true
            };
          } else {
            //then just return the bestmatch
            return locale().bestmatch();
          }
          //if override is an object
        } else if (_.isObject(override)) {
          if (override.locale) {
            return {
              locale: localemap.gengo[override.locale],
              override: true
            };
          } else {
            //then just return the bestmatch
            return locale().bestmatch();
          }
        }
      } else {
        //then just return the bestmatch
        return locale().bestmatch();
      }
    }
    //separates the phrase into 4 parts: object, brackets, dots, phrases.
    function discern(phrase, value, args) {
      //called like this: __({locale: 'ja', phrase: 'Hello', count: 2}, something)
      if (_.isObject(phrase)) {
        //if locale exists
        if (phrase.locale) {
          if (_.isEmpty(value) && _.isEmpty(args)) {
            value = {};
            value.locale = localemap.gengo[phrase.locale];
          } else {
            //just append it to value
            if (!_.isEmpty(value)) {
              value.locale = localemap.gengo[phrase.locale];

            }
            //just append it to args
            if (!_.isEmpty(args)) {
              args.push({
                locale: localemap.gengo[phrase.locale]
              });
            }
          }
        }
        //count exists
        if (phrase.count) {
          if (_.isEmpty(value) && _.isEmpty(args)) {
            value = {};
            value.count = phrase.count;
          } else {
            //just append it to value
            if (!_.isEmpty(value)) {
              value.count = phrase.count;
            }
            //just append it to args
            if (!_.isEmpty(args)) {
              args.push({
                count: phrase.count
              });
            }
          }
        }
        //if phrase exists
        if (phrase.phrase) {
          //then let expression and parser handle the rest
          return parser(expression(phrase.phrase).phrase, value, args, expression(phrase.phrase).type);
        } else {
          debug("No phrase found in object.").error();
        }
        //called like this __("something", something)
      } else if (_.isString(phrase)) {
        //then let expression and parser handle the rest
        return parser(expression(phrase).phrase, value, args, expression(phrase).type);
      }

    }
    //tells parser which type of parser is needed for the phrase.
    function expression(phrase) {
      //if the phrase contains brackets
      if (regex(phrase).Bracket().match()) {

        debug("module: core, fn: core, Input contains brackets").debug();
        debug(phrase).data();
        //return the regex result and the type of parser
        return {
          phrase: regex(phrase).Bracket().exec(),
          type: 'bracket'
        };
        //if the phrase contains dots
      } else if (regex(phrase).Dot().match()) {

        debug("module: core, fn: core, Input contains dots").debug();
        debug(phrase).data();
        return {
          phrase: phrase,
          type: 'dot'
        };
        //if the phrase is just something ordinary
      } else {
        debug("module: core, fn: core, Input contains phrases").debug();
        debug(phrase).data();
        return {
          phrase: phrase,
          type: 'phrase'
        };

      }
    }
    //parser will let parse know what to do and also return
    //the string with mustache and kawari if needed.
    function parser(phrase, value, args, type) {
      var result;
      //called like this __(something)
      if (_.isEmpty(value) && _.isEmpty(args)) {
        return parse[type](phrase, negotiate(), false);
        //called like this __(something, {something})
      } else if (!_.isEmpty(value)) {
        result = parse[type](phrase, negotiate(value), isPlural(value.count));
        if (regex(result).Mustache().match()) {
          result = mustache.render(result, value);
        }
        if (regex(result).Sprintf().match()) {
          result = kawari(result, value.sprintf);
        }
        return result;
        //called like this __(something, something)
      } else if (!_.isEmpty(args)) {
        //if only one argument exists
        if (args.length === 1) {
          var arg = args[0];
          //called like this __(something, 'something')
          if (_.isString(arg)) {
            ////called like this __(something, '2')
            if (parseInt(arg)) {
              result = parse[type](phrase, negotiate(), isPlural(arg));
              if (regex(result).Sprintf().match()) {
                return kawari(result, arg);
              } else {
                return result;
              }
            } else if (localemap.gengo[arg]) {
              return parse[type](phrase, negotiate(arg), false);
            } else {
              result = parse[type](phrase, negotiate(), false);
              if (regex(result).Sprintf().match()) {
                return kawari(result, arg);
              } else {
                return result;
              }
            }
            //called like this __(something, 2)
          } else if (_.isNumber(arg)) {
            result = parse[type](phrase, negotiate(), isPlural(arg));
            if (regex(result).Sprintf().match()) {
              return kawari(result, arg);
            } else {
              return result;
            }
            //called like this __(something, [something])
          } else if (_.isArray(arg)) {
            result = parse[type](phrase, negotiate(), false);
            if (regex(result).Sprintf().match()) {
              return kawari(result, arg);
            }
          }
          //called like this __(something, 'something', {something}, 'something', 2)
        } else {
          //lets separate them even further
          var objects = [],
            other = [];
          //combine the non objects into an array
          for (var i = 0; i < args.length; i++) {
            if (_.isObject(args[i])) {
              objects.push(args[i]);
            } else {
              if ((!_.isArray(args[i]))) {
                other.push(args[i]);
              }
            }
          }
          //combine the objects
          var target = {};
          objects.forEach(function(object) {
            _.each(object, function(value, prop) {
              target[prop] = value;
            });
          });

          result = parse[type](phrase, negotiate(target), isPlural(target));
          if (regex(result).Mustache().match()) {
            result = mustache.render(result, target);
          }
          if (regex(result).Sprintf().match()) {
            result = kawari(result, other);
          }
          return result;
        }
      }
    }
    //checks if plural is necessary. Using simple algm: count > 1
    function isPlural(num) {
      var count;
      if (_.isString(num)) {
        count = parseInt(num);
      } else {
        count = num;
      }
      return count > 1;
    }
    //let discern handle the difference and markdown
    //take care of any markdown syntax
    return markdown(discern(phrase, value, args));
  };
  //lib takes care of changing the locales of moment and numeral
  lib = function(input) {
    return {
      moment: function(override) {
        try {
          if (input) {

            moment.locale(localemap.moment[input]);
            return moment;
          }

          if (override) {
            var localmoment = require('moment');
            localmoment.locale(localemap.moment[override]);
            return localmoment;
          }
        } catch (error) {
          debug("module: core, fn: moment" + error.toString().replace("Error: ", " ")).error();
        }
      },
      numeral: function(override) {
        if (input) {
          try {
            //if for some reason our locale is English
            if (localemap.numeral[input] === 'en') {
              //set numeral's language
              return numeral.language('en');
            } else {
              //load the language
              numeral.language(localemap.numeral[input], require('numeral/languages/' + localemap.numeral[input] + '.js'));
              //set the language
              numeral.language(localemap.numeral[input]);
              return numeral;
            }

          } catch (error) {
            debug("module: core, fn: numeral" + error.toString().replace("Error: ", " ")).error();
          }
        }

        if (override) {
          try {
            var localenumeral = require('numeral');
            //if for some reason our locale is English
            if (localemap.numeral[override] === 'en') {
              //set numeral's language
              localenumeral.language('en');
              return localenumeral;
            } else {
              //load the language

              localenumeral.language(localemap.numeral[override], require('numeral/languages/' + localemap.numeral[override] + '.js'));
              //set the language
              localenumeral.language(localemap.numeral[override]);
              return localenumeral;
            }

          } catch (error) {
            debug("module: core, fn: numeral" + error.toString().replace("Error: ", " ")).error();
          }
        }

      }
    };

  };


  // Credits to @Mashpie https://github.com/mashpie
  //locale takes care of setting the locales, default locales, etc.
  locale = function(req) {
    if (_.isObject(req)) {
      var langheader = req.headers['accept-language'],
        languages = [],
        regions = [];
      req.languages = [localemap.gengo[config().default()]];
      req.regions = [localemap.gengo[config().default()]];
      req.language = localemap.gengo[config().default()];
      req.region = localemap.gengo[config().default()];
      if (langheader) {
        var match, fallbackMatch;
        requested = acceptedlang(langheader);
        for (var i = 0, len = requested.length; i < len; i++) {
          var lang = requested[i],
            lr = lang.split('-', 2),
            parentLang = lr[0],
            region = lr[1];
          languages.push(parentLang.toLowerCase());
          if (region) {
            regions.push(region.toLowerCase());
          }
          if (!match && (config().supported().indexOf(localemap.gengo[lang]) !== -1)) {
            match = lang;
          }

          if (!fallbackMatch && (config().supported().indexOf(localemap.gengo[parentLang]) === -1)) {
            fallbackMatch = parentLang;
          }
        }
        req.language = match || fallbackMatch || req.language;
        req.region = regions[0] || req.region;
      }
      // setting the language by cookie
      if (req.cookies && req.cookies[config().cookie()]) {
        req.language = localemap.gengo[req.cookies[config().cookie()]];
      }
      gengo.setLocale(req, req.language);
    }
    /**
     * Credits to @Mashpie https://github.com/mashpie
     * https://github.com/mashpie/i18n-node/blob/master/i18n.js#L332
     * Get a sorted list of accepted languages from the HTTP Accept-Language header
     */
    function acceptedlang(header) {
      var languages = header.split(','),
        preferences = {};
      return languages.map(function parseLanguagePreference(item) {
        var preferenceParts = item.trim().split(';q=');
        if (preferenceParts.length < 2) {
          preferenceParts[1] = 1.0;
        } else {
          var quality = parseFloat(preferenceParts[1]);
          preferenceParts[1] = quality ? quality : 0.0;
        }
        preferences[preferenceParts[0]] = preferenceParts[1];
        return preferenceParts[0];
      }).filter(function(lang) {
        return preferences[lang] > 0;
      }).sort(function sortLanguages(a, b) {
        return preferences[b] - preferences[a];
      });
    }
    return {
      supported: function() {
        return config().supported();
      },
      requested: function() {
        return requested;
      },
      default: function() {
        return config().default();
      },
      bestmatch: function() {
        return (gengo.getLocale() === config().default()) ? config().default() : gengo.getLocale();
      }
    };
  };


  /************************************
        Exposing Gengo
    ************************************/

  // CommonJS module is defined
  if (hasModule) {
    module.exports = gengo;
  }

  /*global ender:false */
  if (typeof ender === 'undefined') {
    // here, `this` means `window` in the browser, or `global` on the server
    // add `gengo` as a global object via a string identifier,
    // for Closure Compiler 'advanced' mode
    this.gengo = gengo;
  }

  /*global define:false */
  if (typeof define === 'function' && define.amd) {
    define([], function() {
      return gengo;
    });
  }
}).call(this);