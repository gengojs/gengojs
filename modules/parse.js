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
        regex = utils.regex,
        debug = utils.debug,
        keywords = config().keywords();

    //normal parser for phrases
    parse = function(phrase, locale, plural) {
        var result, routeResult;
        try {
            if (isOverride(locale)) {
                result = new loader(locale.locale).json();
            } else {
                result = loader(locale).json();
            }
            if (config().router()) {
                if (router().route().length() === 0) {
                    routeResult = resultParser(result[router().route().dot()][phrase], locale, plural);
                } else {
                    routeResult = resultParser(dotParser(router().route().dot(), result)[phrase], locale, plural);
                }
                //if result still has trouble
                if (!routeResult) {
                    //try universe
                    routeResult = resultParser(result[config().keywords().universe][phrase], locale, plural);
                }
                return routeResult;
            } else {
                return resultParser(result[phrase], locale, plural);
            }
        } catch (error) {
            debug("module: parse fn: parse, " + error.toString().replace("Error: ", " ")).error();
        }
    };

    /*
    @param {RegEx Array} input
    @param {String} locale
    @param {Boolean} plural
    */
    //bracket handler
    parse.bracket = function(input, locale, plural) {
        var search, dot;
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
            var result, routeResult;
            if (isOverride(locale)) {
                result = new loader(locale.locale).json();
            } else {
                result = loader(locale).json();
            }

            if (config().router()) {
                if (router().route().length() === 0) {
                    routeResult = result[router().route().dot()];
                } else {
                    routeResult = dotParser(router().route().dot(), result);

                }
                //if result still has trouble
                if (!routeResult) {
                    //try universe
                    routeResult = result[config().keywords().universe];
                    if (routeResult) {
                        result = routeResult[search];
                    }
                } else {
                    result = routeResult[search];
                }
            } else {
                result = result[search];
            }
            if (dot) {
                if (regex(dot).Dot().match()) {
                    //then the dot is 'dot.dot.dot'
                    return resultParser(dotParser(dot, result), locale, plural);

                } else {
                    //then the dot is only 'dot'
                    return resultParser(result[dot], locale, plural);
                }
            } else {
                return resultParser(result, locale, plural);
            }
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
        try {
            debug(search).debug("module parse, fn: bracket, Parse Bracket search");
            var result, routeResult;
            if (isOverride(locale)) {
                result = new loader(locale.locale).json();
            } else {
                result = loader(locale).json();
            }
            if (config().router()) {
                if (router().route().length() === 0) {
                    routeResult = result[router().route().dot()];
                } else {
                    routeResult = dotParser(router().route().dot(), result);
                }
                //if result still has trouble
                if (!routeResult) {
                    //try universe
                    routeResult = result[config().keywords().universe];
                    if (routeResult) {
                        result = routeResult;
                    }
                } else {
                    result = routeResult;
                }
            }
            return resultParser(dotParser(search, result), locale, plural);
        } catch (error) {
            debug("module: parse fn: dot," + error.toString().replace("Error: ", " ")).error();
        }
    };

    /*
     *   Private functions
     */
    //http://stackoverflow.com/a/14375828/1251031
    function dotParser(input, obj) {
        return input.split('.').reduce(function(obj, p) {
            return obj[p];
        }, obj);
    }

    function resultParser(result, locale, plural) {
        var _result;
        if (_.isString(result)) {
            return result;
        } else if (_.isObject(result)) {
            if (isDefault(locale)) {
                //check if the keyword 'default' exist in the object
                if (Object.keys(result).indexOf(config().keywords().default) !== -1) {

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
                if (Object.keys(result).indexOf(config().keywords().translated) !== -1) {
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
    }

    function isDefault(input) {
        if (input === config().default()) {
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
