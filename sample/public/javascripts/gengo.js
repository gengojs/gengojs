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
            if (typeof source[property] === "object") { // if this is an object
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
        locale = {},
        VERSION = '0.0.1',
        CONFIG = {
            localePath: require('app-root-path') + '/locales/',
            debug: false
        },
        currentLocale,
        lang = {
            ja: 'ja',
            en: 'en',
            'en-US': 'en-US'
        };


    /************************************
        Top Level Functions
    ************************************/

    gengo = function(input) {
        if (currentLocale === lang.en || currentLocale === lang['en-US']) {
        	debug(input, 'input');
            return input;
        }else{
        	loadLocale();
        	debug(locale[input], 'output');
        	return locale[input];
        }
    };

    gengo.version = VERSION;

    gengo.init = function(app) {
        app.use(require('locale')(['ja', 'en']));
        app.use(function(req, res, next) {
            currentLocale = req.locale;
            debug(currentLocale, 'current locale');
            res.locals.__ = gengo;
            next();
        });
    };
    gengo.config = function(config){
    	CONFIG = Object.extender(CONFIG, config);
    };

    /************************************
        Private Functions
    ************************************/

    function loadLocale() {
        locale = require(CONFIG.localePath + lang[currentLocale] + '.js');
        debug(locale, 'loaded locale');
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
