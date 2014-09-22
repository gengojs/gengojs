/*jslint node: true, forin: true, jslint white: true, newcap: true*/
/*global console*/
/*
 * genogjs core
 * author : Takeshi Iwana
 * https://github.com/iwatakeshi
 * license : MIT
 * Code heavily borrowed from Adam Draper
 * https://github.com/adamwdraper
 */

(function() {
    'use strict';

    var core,
        _ = require('underscore'),
        utils = require('./utils.js'),
        isDefined = utils.isDefined,
        config = require('./config.js'),
        parse = {
            phrase: require('./parse.js'),
            bracket: require('./parse.js').bracket,
            dot: require('./parse.js').dot
        },
        regex = utils.regex,
        debug = utils.debug,
        locale = require('./locale.js'),
        cookie = require('./cookie.js'),
        locales = require('../maps/locales.js'),
        mustache = require('mustache'),
        kawari = require('kawari'),
        markdown = require('./markdown'),
        hasModule = (typeof module !== 'undefined' && module.exports);

    /************************************
        Top Level Functions
    ************************************/

    //http://stackoverflow.com/a/2141530/1251031
    core = function(phrase, value, args) {

        debug("module, core, fn: core, Input").info();
        debug(phrase).info();
        debug(value).info();
        debug(args).info();
        return markdown(discern(phrase, value, args));
    };
    core.locale = function() {
        return negotiate();
    };
    //decides which locale to use
    function negotiate(override) {
        if (override) {
            if (_.isString(override)) {
                //check if a locale exists
                if (locales.gengo[override]) {
                    return {
                        locale: locales.gengo[override],
                        override: true
                    };
                } else {
                    return decide();
                }
            } else if (_.isObject(override)) {
                if (override.locale) {
                    return {
                        locale: override.locale,
                        override: true
                    };
                } else {
                    return decide();
                }
            }
        } else {
            return decide();
        }

        function decide() {
            if ((cookie().locale() === config().default()) || (locale().bestmatch() === config().default()) === false) {
                if (cookie().isSet()) {
                    debug(cookie().locale()).debug("module: core, fn: negotiate, Return cookie");
                    return cookie().locale();
                } else {
                    debug(locale().bestmatch()).debug("module: core, fn: negotiate, Return Best match");
                    return locale().bestmatch();
                }
            } else {
                return config().default();
            }
        }

    }


    //separates the phrase into 4 parts: object, brackets, dots, phrases.
    function discern(phrase, value, args) {
        if (_.isObject(phrase)) {
            /* __({locale: 'ja', phrase: 'Hello', count: 2}, something) - arg2 = object*/
            if (phrase.locale) {
                if (!_.isEmpty(value)) {
                    value.locale = phrase.locale;
                }
                if (!_.isEmpty(args)) {
                    args.push({
                        locale: phrase.locale
                    });
                }
            }
            if (phrase.count) {
                if (!_.isEmpty(value)) {
                    value.count = phrase.count;
                }
                if (!_.isEmpty(args)) {
                    args.push({
                        count: phrase.count
                    });
                }
            }
            //recusive call to reduce the amount of code
            if (phrase.phrase) {
                return parser(expression(phrase.phrase).phrase, value, args, expression(phrase.phrase).type);
            } else {
                debug("No phrase found in object.").error();
            }
        } else if (_.isString(phrase)) {
            return parser(expression(phrase).phrase, value, args, expression(phrase).type);
        }

    }

    function expression(phrase) {
        //if the phrase contains brackets
        if (regex(phrase).Bracket().match()) {

            debug("module: core, fn: core, Input contains brackets").debug();
            debug(expression).data();
            return {
                phrase: regex(phrase).Bracket().exec(),
                type: 'bracket'
            };

        } else if (regex(phrase).Dot().match()) {

            debug("module: core, fn: core, Input contains dots").debug();
            debug(phrase).data();
            return {
                phrase: phrase,
                type: 'dot'
            };
        } else {
            debug("module: core, fn: core, Input contains phrases").debug();
            debug(phrase).data();
            return {
                phrase: phrase,
                type: 'phrase'
            };

        }
    }

    function parser(phrase, value, args, type) {
        var result;
        try {
            if (_.isEmpty(value) && _.isEmpty(args)) {
                return parse[type](phrase, negotiate(), false);
            } else if (!_.isEmpty(value)) {
                result = parse[type](phrase, negotiate(value), isPlural(value.count));
                if (regex(result).Mustache().match()) {
                    result = mustache.render(result, value);
                }
                if (regex(result).Sprintf().match()) {
                    result = kawari(result, value.sprintf);
                }
                return result;
            } else if (!_.isEmpty(args)) {
                if (args.length === 1) {
                    var arg = args[0];
                    if (_.isString(arg)) {
                        if (parseFloat(arg)) {
                            result = parse[type](phrase, negotiate(), isPlural(arg));
                            if (regex(result).Sprintf().match()) {
                                return kawari(result, arg);
                            } else {
                                return result;
                            }
                        } else if (locales.gengo[arg]) {
                            return parse[type](phrase, negotiate(arg), false);
                        } else {
                            result = parse[type](phrase, negotiate(), false);
                            if (regex(result).Sprintf().match()) {
                                return kawari(result, arg);
                            } else {
                                return result;
                            }
                        }
                    } else if (_.isNumber(arg)) {
                        result = parse[type](phrase, negotiate(), isPlural(arg));
                        if (regex(result).Sprintf().match()) {
                            return kawari(result, arg);
                        } else {
                            return result;
                        }
                    } else if (_.isArray(arg)) {
                        result = parse[type](phrase, negotiate(), false);
                        if (regex(result).Sprintf().match()) {
                            return kawari(result, arg);
                        }
                    }
                } else {
                    var objects = [],
                        other = [];
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

                    if (target.count) {
                        //append that to the other's array
                        other.push(target.count);
                    }
                    if (regex(result).Mustache().match()) {
                        result = mustache.render(result, target);
                    }
                    if (regex(result).Sprintf().match()) {
                        result = kawari(result, other);
                    }
                    return result;
                }
            }
        } catch (error) {
            debug("module: core fn: parser," + error.toString().replace("Error: ", " ")).error();
        }
    }

    function isPlural(num) {
        var count;
        if (_.isString(num)) {
            count = parseInt(num);
        } else {
            count = num;
        }
        return count > 1;
    }

    /************************************
        Exposing Core
    ************************************/

    // CommonJS module is defined
    if (hasModule) {
        module.exports = core;
    }

    /*global ender:false */
    if (typeof ender === 'undefined') {
        // here, `this` means `window` in the browser, or `global` on the server
        // add `core` as a global object via a string identifier,
        // for Closure Compiler 'advanced' mode
        this.core = core;
    }

    /*global define:false */
    if (typeof define === 'function' && define.amd) {
        define([], function() {
            return core;
        });
    }
}).call(this);
