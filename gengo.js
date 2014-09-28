/*jslint node: true, forin: true, jslint white: true, newcap: true*/
/*global console*/
/*
 * gengojs
 * version : 0.2.26
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

    function isDefined(value) {
        var valuetype = typeof value;
        debug(valuetype, "fn: isDefined, Value type");
        switch (valuetype) {
            case "object":
                debug(value, "fn: isDefined, Value value");
                if (_.isNull(value) || _.isEmpty(value)) {
                    debug("fn: isDefined, Value is emtpy or null");
                    return false;
                }
                return true;
            case "string":
                if (value === "" || value === "null") {
                    debug("fn: isDefined, Value has empty strings or a string with null");
                    return false;
                }
                return true;
            case "undefined":
                debug(" fn: isDefined, Value is undefined");
                return false;
            default:
                return true;
        }
    }
    /************************************
        Constants & Variables
    ************************************/
    //gengo itself of course!

    var gengo,
        //get an instance of moment for date formatting
        moment = require('moment'),
        //get an instance of numeral for number formatting
        numeral = require('numeral'),
        //get an instance of sprintf for string replacement
        sprintf = require("sprintf-js").sprintf,
        //get an instance of vsprintf strint replacement
        vsprintf = require("sprintf-js").vsprintf,
        //get an instance of fs for local file reading
        fs = require('fs'),
        //get an instance of xml2js for xml parsing
        xml2js = require('xml2js'),
        //get an instance of underscore
        _ = require('underscore'),
        //get an instance of locale
        _locale = require('locale'),
        // check for nodeJS
        hasModule = (typeof module !== 'undefined' && module.exports),
        //version
        VERSION = '0.2.26',
        //configuration with defaults set
        CONFIG = {
            //set gengo global variable
            gengo: "__",
            //set moment global variable
            moment: "moment",
            //set numeral global variable
            numeral: "numeral",
            //set path to locale
            localePath: require('app-root-path') + '/locales/',
            //set to false; for debugging purposes
            debug: false,
            //set supported locales
            supported: ['en_US', 'en'],
            //set default locale, which would be the locale used for your template of choice
            default: 'en_US',
            //set view aware
            routeAware: false,
            //set default routes
            routes: {
                '*': 'gengo',
                '/': 'index'
            },
            //set universe, which enables you to use a set of dictionaries in any where in your site (with routeAware)
            universe: false
        },
        //The locale that is the best match chosen by 'locale' (library)
        BESTMATCH,
        //the route from req.path
        ROUTE,
        //the locale stored from the cookie
        COOKIELOCALE = "",
        //the current locale
        CURRENTLOCALE = "",
        //the current language
        CURRENTLANG = "",
        //stores the JSON universal translations
        UNIVERSEJSON = {},
        //stores the xml universal translations
        UNIVERSEXML = {},
        //set the path to numeral's language file
        NUMERALPATH = 'numeral/languages/',
        //stores the JSON locale from locales folder
        LOCALEJSON = {},
        //stores the XML locale from the locales folder
        LOCALEXML = {},
        //maps the languages according to each library's file name (may be moved to an external folder)
        LOCALES = require('./maps/locales.js'),
        //maps the locale and language for gengo, moment, numeral (may be moved to an external folder)
        LANG = require('./maps/langs.js');


    /************************************
        Top Level Functions
    ************************************/
    /*
     * @descrition Recieves a string and returns an unmodified or modified string.
     * @method main
     * @param {String} input
     * @param {Object, Array, String} arg
     */
    gengo = function(input, arg) {
        debug('-----------------------------------');
        debug(input, 'fn: gengo, Input');
        //check to see if COOKIELOCALE || BESTMATCH === default
        switch (isDefault()) {
            case true:
                debug('fn: gengo, isDefault');
                //set the current locale to default
                CURRENTLOCALE = CONFIG.default;
                //set the current language to default
                CURRENTLANG = LANG[CURRENTLOCALE];
                //set moment's locale to default
                setMoment(LOCALES.moment[CONFIG.default]);
                //set numeral's language to default
                setNumeral(LOCALES.numeral[CONFIG.default]);
                //just return what was given but check if there are any args.
                return hasArg(input, arg);
            case false:
                switch (loadLocale()) {
                    case true:
                        //let routeAwareHandler take care of the route handling
                        return routeAwareHandler(input, arg);
                    case false:
                        //just return what was given but check if there are any args.
                        return hasArg(input, arg);

                } //end switch(loadLocale())
        } //end switch(isDefault())
    };
    //gengo version
    gengo.version = VERSION;

    /*
     * @method init
     * @param {Express} app
     */
    gengo.init = function(app) {
        //set locale's supported locale.
        app.use(_locale(CONFIG.supported));
        //capture the events that occur in express
        app.use(function(req, res, next) {
            //get the route
            ROUTE = req.path;
            try {
                debug(req.cookies.locale, "fn: init, req.cookies.locale");
                //set req.cookies.locale
                COOKIELOCALE = req.cookies.locale;

            } catch (error) {
                debug("fn: init, req.cookies.locale is not defined.");
            }


            debug(ROUTE, "fn: init, Route");
            debug(req.headers['accept-language'], "fn: init, Accept-Language");
            debug(COOKIELOCALE, "fn: init, Cookie locale");
            //for some reason best match can return 'en_US.UTF-8'
            //we only care for en_US
            if (req.locale.indexOf('.') !== -1) {
                //set the best match given by locale
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
            //set the locale and language
            setLangLocale();
            //set gengo's global variable and expose it
            res.locals[CONFIG.gengo] = gengo;
            //set moment's global variable and expose it
            res.locals[CONFIG.moment] = moment;
            //set numeral's global variable and expose it
            res.locals[CONFIG.numeral] = numeral;
            next();
        });
    };
    //set and extend CONFIG
    gengo.config = function(config) {
        //do additional stuff to the config
        if (isDefined(config.localePath)) {

            // select the last character and compares
            if (config.localePath.substr(-1) !== '/') {
                // If the last character is not a slash
                config.localePath += "/";
            }
        }
        CONFIG = Object.extender(CONFIG, config);
    };
    //expose the locale
    gengo.locale = function() {
        return CURRENTLOCALE;
    };
    //expose the language
    gengo.language = function() {
        return CURRENTLANG;
    };

    /************************************
        Private Functions
    ************************************/
    /*
     * @description Takes care of the routing and return the appropriate translation
     * @method main
     * @param {String} input
     * @param {Object, Array, String} arg
     */
    function routeAwareHandler(input, arg) {
        switch (CONFIG.routeAware) {
            case true:
                loadJSONUniverse();
                loadXMLUniverse();

                var json = JSONRouter();
                var xml = XMLRouter();
                if (isDefined(json)) {
                    if (isDefined(json[input])) {
                        return hasArg(json[input], arg);
                    }
                }
                if (isDefined(xml)) {
                    if (isDefined(xml[input])) {
                        return hasArg(xml[input], arg);
                    }
                }
                if (isDefined(UNIVERSEJSON)) {
                    if (UNIVERSEJSON[input]) {
                        return hasArg(UNIVERSEJSON[input], arg);
                    }
                }
                if (isDefined(UNIVERSEXML)) {
                    if (UNIVERSEXML[input]) {
                        return hasArg(UNIVERSEXML[input], arg);
                    }
                }

                break;
            case false:
                debug(LOCALEJSON[input], 'fn: gengo, Output');
                if (isDefined(LOCALEJSON)) {
                    if (isDefined(LOCALEJSON[input])) {
                        return hasArg(LOCALEJSON[input], arg);
                    }
                }

                if (isDefined(XMLLocale())) {
                    if (isDefined(XMLLocale()[input])) {
                        return hasArg(XMLLocale()[input], arg);
                    }
                }
                break;
        } //end switch(CONFIG.routeAware)
    }
    /*
     * @description Loads the locales.
     * @return bool success
     */
    function loadLocale() {
        try {
            //check if COOKIELOCALE is defined since it has top priority
            switch (isDefined(COOKIELOCALE)) {
                case true:
                    debug(COOKIELOCALE, 'fn: loadLocale, In COOKIELOCALE');
                    //load the JSON locale
                    loadLocaleJSON(COOKIELOCALE);
                    //load the XML locale
                    loadLocaleXML(LOCALES.gengo[COOKIELOCALE]);
                    //set moment's locale
                    setMoment(LOCALES.moment[COOKIELOCALE]);
                    //set numeral's language
                    setNumeral(LOCALES.numeral[COOKIELOCALE]);
                    //set the current locale
                    setLangLocale();
                    //load successful
                    return true;
                case false:
                    //load the JSON locale
                    loadLocaleJSON(BESTMATCH);
                    //load the XML locale
                    loadLocaleXML(LOCALES.gengo[BESTMATCH]);
                    //set moment's locale
                    setMoment(LOCALES.moment[BESTMATCH]);
                    //set numeral's language
                    setNumeral(LOCALES.numeral[BESTMATCH]);
                    //set the current locale
                    setLangLocale();
                    //load successful
                    return true;
            }
        } catch (error) {
            debug(error, "fn: loadLocale, uh oh something went wrong");
        }
        //load not successful
        return false;
    }

    /*
     * @description Loads the JSON locale
     */
    function loadLocaleJSON(locale) {
        try {
            //set the json locale
            LOCALEJSON = require(CONFIG.localePath + LOCALES.gengo[locale] + '.js');
        } catch (error) {
            debug(error, "fn: loadLocaleJSON, uh oh something went wrong");
        }

    }
    /*
     * @description Loads the XML locale
     */
    function loadLocaleXML(locale) {
        var parser = new xml2js.Parser();
        try {
            //parse the xml
            parser.parseString(fs.readFileSync(CONFIG.localePath + locale + ".xml"), function(error, result) {
                //set the xml locale
                LOCALEXML = result;
                debug(LOCALEXML);
                debug(LOCALEXML);
            });
        } catch (error) {
            debug(error, "fn: loadLocaleXML, uh oh something went wrong");
        }
    }
    /*
     * @description set moment's locale
     */
    function setMoment(locale) {
        //set momement's locale
        moment.locale(locale);
        debug(moment.locale(), 'fn: setMoment, Current moment language');
        debug(moment().format('dddd'), 'fn: setMoment, Current moment: Today is');
    }
    /*
     * @description set numeral's language
     */
    function setNumeral(locale) {
        //if for some reason our locale
        if (locale === 'en') {
            //set numeral's language
            numeral.language('en');
        } else {
            //load the language
            numeral.language(locale, require(NUMERALPATH + locale));
            //set the language
            numeral.language(locale);
        }
        debug(numeral.language(), 'fn: setNumeral, Current numeral language');
        debug(numeral(10000).format('$0,0.00'), 'fn: setNumeral, Current numeral: I don\'t have');
    }

    /*
     * @description Shows the events occuring in gengo
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

    /*
     * @description Checks if either COOKIELOCALE or BESTMATCH is equal to default
     */
    function isDefault() {
        switch (isDefined(COOKIELOCALE)) {
            //if COOKIELOCALE is defined
            case true:
                //if COOKIELOCALE === default
                //return if COOKIELOCALE is equal to default
                return COOKIELOCALE === CONFIG.default;
                //then fall back to BESTMATCH
            case false:
                //if BESTMATCH === default
                return BESTMATCH === CONFIG.default;
        }
    }

    /*
     * @description Checks arg is set
     */
    function hasArg(input, arg) {
        if (arg) {
            debug(replace(input, arg), 'fn: gengo, Output with arg');
            return replace(input, arg);
        } else {
            return input;
        }
    }

    /*
     * @description Checks if the route in the JSON definition exists
     * @return Returns the root of the route from the definition
     */
    function JSONRouter() {
        return LOCALEJSON[CONFIG.routes[ROUTE]];
    }

    /*
     * @description Checks if the route in the XML definition exists
     * @return Returns the root of the route from the definition
     */
    function XMLRouter() {
        switch (isDefined(LOCALEXML)) {
            case true:
                var localexml = LOCALEXML.begin[CONFIG.routes[ROUTE]],
                    localexmljson = {};
                if (isDefined(localexml)) {
                    localexml = localexml[0];
                    _.each(localexml, function(value) {
                        _.each(value, function(_value) {
                            localexmljson[_value.key.toString()] = _value.value.toString();
                        });
                    });
                }


                return localexmljson;
            case false:
                return {};
        }
    }
    /*
     * @description Constructs an JSON structure from the loaded XML when view aware is disabled
     */
    function XMLLocale() {
        switch (isDefined(LOCALEXML)) {
            case true:
                var localexmljson = {};
                _.each(LOCALEXML.begin, function(value) {
                    _.each(value, function(_value) {
                        localexmljson[_value.key.toString()] = _value.value.toString();
                    });
                });
                return localexmljson;
            case false:
        }
    }
    /*
     * @description Loads the JSON universe route
     */
    function loadJSONUniverse() {
        if (CONFIG.universe) {
            UNIVERSEJSON = LOCALEJSON[CONFIG.routes["*"]];
            if (isDefined(UNIVERSEJSON)) {
                debug(UNIVERSEJSON, 'fn: loadJSONUniverse, UNIVERSEJSON loaded');
            } else {
                debug('fn: loadJSONUniverse, unable to load UNIVERSEJSON or does not exist.');
            }
        }
    }
    /*
     * @description Loads the XML universe route
     */
    function loadXMLUniverse() {
        if (CONFIG.universe) {
            var universexml = {};
            try {
                _.each(LOCALEXML.begin[CONFIG.routes["*"]][0], function(value) {
                    _.each(value, function(_value) {
                        universexml[_value.key.toString()] = _value.value.toString();
                    });

                });
                UNIVERSEXML = universexml;
            } catch (error) {
                UNIVERSEXML = {};
            }
            if (isDefined(UNIVERSEXML)) {
                debug(UNIVERSEXML, 'fn: loadXMLUniverse, UNIVERSEXML loaded');
            } else {
                debug("fn: loadXMLUniverse, unable to load UNIVERSEXML or does not exist.");
            }
        }
    }

    /*
     * @description Replaces the strings with other strings at a desired location.
     */
    function replace(input, arg) {

        if (_.isArray(arg)) {
            return vsprintf(input, arg);
        } else {
            return sprintf(input, arg);
        }
    }
    /*
     * @description Sets the language and the locale
     */
    function setLangLocale() {
        switch (isDefault()) {
            case true:
                CURRENTLOCALE = CONFIG.default;
                CURRENTLANG = LANG[CURRENTLOCALE];
                break;
            case false:
                switch (isDefined(COOKIELOCALE)) {
                    case true:
                        CURRENTLOCALE = LOCALES.gengo[COOKIELOCALE];
                        CURRENTLANG = LANG[CURRENTLOCALE];
                        break;
                    case false:
                        CURRENTLOCALE = LOCALES.gengo[BESTMATCH];
                        CURRENTLANG = LANG[CURRENTLOCALE];
                        break;
                }
                break;
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
