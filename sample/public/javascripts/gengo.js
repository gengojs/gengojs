/*jslint node: true, forin: true, jslint white: true*/
/*global console*/
/*
 * gengojs
 * version : 0.1.10
 * author : Takeshi Iwana
 * https://github.com/iwatakeshi
 * license : MIT
 * Code heavily borrowed from Adam Draper
 * https://github.com/adamwdraper
 */

(function() {
    'use strict';

    /************************************
        Helpers
    ************************************/
    //stackoverflow.com/a/17913898/1251031
    /*
     * @method extender
     * @param {Object} destination
     * @param {Object} source
     */
    Object.extender = function(destination, source) {
        var property;
        for (property in source) { // loop through the objects properties
            if (typeof source[property] === "object") {
                // if this is an object
                destination[property] = destination[property] || {};
                Object.extender(destination[property], source[property]); // recursively deep extend
            } else {
                destination[property] = source[property]; // otherwise just copy
            }
        }
        return destination;
    };

    function isDefined(obj) {

        function isNull(val) {
            if (val === null) {
                return true;
            } else {
                return false;
            }
        }

        function isUndefined(val) {
            if (val === undefined) {
                return true;
            } else {
                return false;
            }
        }

        function isStringEmpty(val) {
            if (val === '' || val === '') {
                return true;
            } else {
                return false;
            }
        }

        if (typeof obj === 'string') {
            if (!isStringEmpty(obj)) {
                if (obj !== 'null') {
                    return true;
                } else {
                    return false;
                }
                return true;
            }
        }
        if (typeof obj === "undefined") {
            debug("In undefined!");
            return !isUndefined(obj);
        } else {
            return !isNull(obj);
        }
    }
    /************************************
        Constants & Variables
    ************************************/

    var gengo,
        moment = require('moment'),
        numeral = require('numeral'),
        sprintf = require("sprintf-js").sprintf,
        vsprintf = require("sprintf-js").vsprintf,
        // check for nodeJS
        hasModule = (typeof module !== 'undefined' && module.exports),
        VERSION = '0.1.10',
        //configuration with defaults set
        CONFIG = {
            //path to locales
            gengo: "__",
            moment: "moment",
            numeral: "numeral",
            localePath: require('app-root-path') + '/locales/',
            //debugging purposes
            debug: false,
            //supported locales
            supported: ['en_US', 'en'],
            default: 'en_US',
            viewAware: false,
            universe: false,
            views: {
                '*': 'gengo',
                '/': 'index'
            }
        },
        BESTMATCH,
        //stores the locale from locales folder
        LOCALE = {},
        //maps the languages according to each library's file name
        LOCALES = {
            gengo: {
                ja: 'ja',
                en: 'en',
                en_US: 'en_US'
            },
            numeral: {
                ja: 'ja',
                en: 'en',
                en_US: 'en'
            },
            moment: {
                ja: 'ja',
                en: 'en',
                en_US: 'en'
            }
        },
        LANG = {
            //key:locale, value: lang
            'ja': 'Japanese',
            'en': 'English',
            'en_US': 'English US'
        },
        ROUTE,
        COOKIELOCALE = "",
        NUMERALPATH = 'numeral/languages/',
        CURRENTLOCALE = "",
        CURRENTLANG = "",
        UNIVERSE = {};


    /************************************
        Top Level Functions
    ************************************/
    /*
     * @method main
     * @param {String} input
     * @param {Object, Array, String} arg
     */
    gengo = function(input, arg) {
        debug('-----------------------------------');
        debug(input, 'fn: gengo, Input');

        //check to see if COOKIELOCALE || BESTMATCH === default
        if (isDefault()) {
            debug('fn: gengo, isDefault');
            CURRENTLOCALE = CONFIG.default;
            CURRENTLANG = LANG[CURRENTLOCALE];
            loadMoment(LOCALES.moment[CONFIG.default]);
            loadNumeral(LOCALES.numeral[CONFIG.default]);
            return hasArg(input, arg);
        } else {

            switch (loadLocale()) {
                case true:
                    if (CONFIG.viewAware) {
                        if (router()) {
                            debug(router()[input], "fn: gengo, Output with viewAware");
                            if (router()[input] !== undefined) {
                                return hasArg(router()[input], arg);
                            } else if (UNIVERSE[input] !== undefined) {
                                debug("HAS arg");
                                return hasArg(UNIVERSE[input], arg);
                            }

                        }
                    } else {
                        debug(LOCALE[input], 'fn: gengo, Output');
                        if (LOCALE[input] !== undefined) {
                            return hasArg(LOCALE[input], arg);
                        } else if (UNIVERSE[input] !== undefined) {
                            return hasArg(UNIVERSE[input], arg);
                        }

                    }
                    break;
                case false:
                    return hasArg(input, arg);
            }
        }
    };

    gengo.version = VERSION;

    gengo.init = function(app) {

        var _locale = require('locale');
        app.use(_locale(CONFIG.supported));
        app.use(function(req, res, next) {
            //get the route
            ROUTE = req.path;
            debug(req.cookies.locale, "fn: init, req.cookies.locale");
            COOKIELOCALE = req.cookies.locale;

            debug(ROUTE, "fn: init, Route");
            debug(req.headers['accept-language'], "fn: init, Accept-Language");
            debug(COOKIELOCALE, "fn: init, Cookie locale");
            //for some reason best match can return 'en_US.UTF-8'
            //we only care for en_US
            if (req.locale.indexOf('.') !== -1) {
                BESTMATCH = BESTMATCH.split('.')[0];
            } else {
                BESTMATCH = req.locale;
            }

            if (moment) {
                debug("fn: init, moment is defined.");
            }
            if (numeral) {
                debug("fn: init, numeral is defined.");
            }
            setLangLocale();
            res.locals[CONFIG.gengo] = gengo;
            res.locals[CONFIG.moment] = moment;
            res.locals[CONFIG.numeral] = numeral;
            next();
        });
    };

    gengo.config = function(config) {
        CONFIG = Object.extender(CONFIG, config);
    };

    gengo.getLocale = function() {

        return CURRENTLOCALE;
    };

    gengo.getLanguage = function() {
        debug(CURRENTLANG, "fn: getLanguage, current language is");
        return CURRENTLANG;
    };

    /************************************
        Private Functions
    ************************************/

    function loadLocale() {
        //COOKIELOCALE has top priority if set
        if (isDefined(COOKIELOCALE)) {
            debug(COOKIELOCALE, 'fn: loadLocale, In COOKIELOCALE');
            LOCALE = require(CONFIG.localePath + LOCALES.gengo[COOKIELOCALE] + '.js');
            loadMoment(LOCALES.moment[COOKIELOCALE]);
            loadNumeral(LOCALES.numeral[COOKIELOCALE]);
            //set the current locale
            setLangLocale();

            return true;
        } else {

            if ((BESTMATCH === CONFIG.default) === false) {
                debug(BESTMATCH, 'fn: loadLocale, In BESTMATCH');
                LOCALE = require(CONFIG.localePath + LOCALES.gengo[BESTMATCH] + '.js');
                loadMoment(LOCALES.moment[BESTMATCH]);
                loadNumeral(LOCALES.numeral[BESTMATCH]);
                setLangLocale();
                return true;
            } else {
                //fall back to default
                debug('fn: loadLocale, Falling back to default.');
                LOCALE = undefined;
                setLangLocale();
                loadMoment(LOCALES.moment[CONFIG.default]);
                loadNumeral(LOCALES.numeral[CONFIG.default]);
                debug("Here");
                return false;
            }
        }

        if (LOCALE) {
            debug("fn: loadLocale, LOCALE loaded.");
        } else {
            debug("fn: loadLocale, Could not load LOCALE.");
        }
    }

    function loadMoment(locale) {
        moment.locale(locale);
        debug(moment.locale(), 'fn: loadMoment, Current moment language');
        debug(moment().format('dddd'), 'fn: loadMoment, Current moment: Today is');
    }

    function loadNumeral(locale) {
        if (locale === 'en') {
            numeral.language('en');
        } else {
            numeral.language(locale, require(NUMERALPATH + locale));
            numeral.language(locale);
        }
        debug(numeral.language(), 'fn: loadNumeral, Current numeral language');
        debug(numeral(10000).format('$0,0.00'), 'fn: loadNumeral, Current numeral: I don\'t have');
    }

    /*
     *@method debug
     *@param {Object} obj
     *@param {String} msg
     */
    function debug(obj, msg) {
        if (CONFIG.debug) {
            if (msg) {
                console.log(msg + ': ');
            }
            console.log(obj);
            console.log();
        }
    }

    //check if COOKIELOCALe or best match is default
    function isDefault() {
        //COOKIELOCALe has top priority if set
        if (isDefined(COOKIELOCALE)) {
            //if COOKIELOCALE === default
            if (COOKIELOCALE === CONFIG.default) {
                return true;
            } else {
                return false;
            }
        } else {
            //If BESTMATCH === default
            if (BESTMATCH === CONFIG.default) {
                return true;
            } else {
                return false;
            }
        }
    }

    function hasArg(input, arg) {
        debug('-----------------------------------');
        debug(arg, 'arg');
        if (arg) {
            debug(replace(input, arg), 'fn: gengo, Output with arg');
            return replace(input, arg);
        } else {
            return input;
        }
    }

    //for viewAware
    function router() {
        //check if the route matches the views from config
        if (CONFIG.views[ROUTE]) {
            /*
            {
                //this will get 'index'
                index: {
                    "define": "here"
                }
            }
          */
            var locale = LOCALE[CONFIG.views[ROUTE]];
            loadUniverse();
            //check if locale is defined
            if (locale) {
                debug("fn: router, Loaded locale with viewAware");
                return locale;
            } else {
                return undefined;
            }
        } else {
            return undefined;
        }
    }

    function loadUniverse() {
        if (CONFIG.universe) {
            UNIVERSE = LOCALE[CONFIG.views["*"]];
            if (UNIVERSE) {
                debug(UNIVERSE, 'fn: loadUniverse, UNIVERSE loaded');
            } else {
                debug("Could not load UNIVERSE");
            }
        }
    }

    //sprintf function
    function replace(input, arg) {

        if (typeof arg === Array) {
            return vsprintf(input, arg);
        } else {
            return sprintf(input, arg);
        }
    }

    function setLangLocale() {
        if (isDefault()) {
            CURRENTLOCALE = CONFIG.default;
            CURRENTLANG = LANG[CURRENTLOCALE];
        } else {
            if (isDefined(COOKIELOCALE)) {
                CURRENTLOCALE = LOCALES.gengo[COOKIELOCALE];
                CURRENTLANG = LANG[CURRENTLOCALE];
            } else {
                if ((BESTMATCH === CONFIG.default) === false) {
                    CURRENTLOCALE = LOCALES.gengo[BESTMATCH];
                    CURRENTLANG = LANG[CURRENTLOCALE];
                } else {
                    CURRENTLOCALE = CONFIG.default;
                    CURRENTLANG = LANG[CURRENTLOCALE];
                }
            }
        }

        debug(CURRENTLOCALE, "fn: loadLocale, current locale is");
        debug(CURRENTLANG, "fn: loadLocale, current language is");
    }

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
