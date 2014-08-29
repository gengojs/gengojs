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

    /************************************
        Constants & Variables
    ************************************/

    var gengo,
        // check for nodeJS
        hasModule = (typeof module !== 'undefined' && module.exports),
        VERSION = '0.0.3',
        //configuration with defaults set
        CONFIG = {
            //path to locales
            localePath: require('app-root-path') + '/locales/',
            //debugging purposes
            debug: false,
            //supported locales
            supported: ['en_US', 'en'],
            default: 'en_US',
            viewAware: false,
            views: {
                '/': 'index'
            }
        },
        BESTMATCH,
        //stores the locale from locales folder
        LOCALE = {},
        LOCALES = {
            ja: 'ja',
            en: 'en',
            en_US: 'en_US'
        },
        ROUTE,
        COOKIELOCALE;


    /************************************
        Top Level Functions
    ************************************/

    gengo = function(input, arg) {

        debug(input, 'fn: gengo, Input');
        //check to see if COOKIELOCALE || BESTMATCH === default
        if (isDefault()) {
            debug('-----------------------------------');
            if (arg !== undefined) {
                return replace(input, arg);
            } else {
                return input;
            }

        } else {
            loadLocale();
            if (CONFIG.viewAware) {
                if (router() !== undefined) {
                    debug(router()[input], "fn: gengo, Output with viewAware");
                    debug('-----------------------------------');

                    if (arg !== undefined) {
                        return replace(router()[input], arg);
                    } else {
                        return router()[input];
                    }
                }


            } else {

                debug(LOCALE[input], 'fn: gengo, Output');
                debug('-----------------------------------');
                if (arg !== undefined) {
                    return replace(LOCALE[input], arg);
                } else {
                    return LOCALE[input];
                }
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
            //get the cookie local if it exists
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
            res.locals.__ = gengo;
            next();
        });
    };

    gengo.config = function(config) {
        CONFIG = Object.extender(CONFIG, config);
    };

    /************************************
        Private Functions
    ************************************/

    function loadLocale() {
        //COOKIELOCALE has top priority if set
        if (COOKIELOCALE) {
            LOCALE = require(CONFIG.localePath + LOCALES[COOKIELOCALE] + '.js');
        } else {
            LOCALE = require(CONFIG.localePath + LOCALES[BESTMATCH] + '.js');
        }

        if (LOCALE) {
            debug("fn: loadLocale, LOCALE loaded.");
        } else {
            debug("fn: loadLocale, Could not load LOCALE.");
        }
    };

    /*
     *@method debug
     *@param {Object} obj
     *@param {String} msg
     */
    function debug(obj, msg) {
        if (CONFIG.debug === true) {
            if (msg) {
                console.log(msg + ': ');
            }
            console.log(obj);
            console.log();
        }
    };

    //check if COOKIELOCALe or best match is default
    function isDefault() {
        //COOKIELOCALe has top priority if set
        if (COOKIELOCALE) {
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
        return false;
    };

    function router() {
        //check if the route matches the views from config
        if (CONFIG.views[ROUTE] !== undefined) {
            /*
            {
                //this will get 'index'
                index: {
                    "define": "here"
                }
            }
          */
            var locale = LOCALE[CONFIG.views[ROUTE]];

            //check if locale is defined
            if (locale !== undefined) {
                debug(locale, "fn: router, Loaded locale with viewAware");
                return locale;
            } else {
                return undefined;
            }
        } else {
            return undefined;
        }
    };

    function replace(input, arg) {
        var sprintf = require("sprintf-js").sprintf,
            vsprintf = require("sprintf-js").vsprintf;

        if (typeof arg === Array) {
            return vsprintf(input, arg);
        } else {
            return sprintf(input, arg);
        }
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
