/*jslint node: true, forin: true, jslint white: true, newcap: true*/
/*
 * config
 * author : Takeshi Iwana
 * https://github.com/iwatakeshi
 * license : MIT
 * Code heavily borrowed from Adam Draper
 * https://github.com/adamwdraper
 */

(function() {
    'use strict';

    var config,
        utils = require('./utils.js'),
        hasModule = (typeof module !== 'undefined' && module.exports),
        defaults = {
            global: {
                //set gengo global variable
                gengo: "__",
                //set moment global variable
                moment: "moment",
                //set numeral global variable
                numeral: "numeral",
            },
            //set path to locale
            directory: require('app-root-path') + '/locales/',
            //set to false; for debugging purposes
            debug: false,
            //set supported locales
            supported: ['en_US'],
            //set default locale, which would be the locale used for your template of choice
            default: 'en_US',
            //set view aware
            router: false,
            keywords: {
                default: 'default',
                translated: 'translated',
                universe: 'gengo',
                plural: 'plural'
            }
        };

    config = function(config) {
        var extended = utils.Object(config).extend(defaults);
        return {
            global: function() {
                return {
                    gengo: function() {
                        return extended.global.gengo;
                    },
                    moment: function() {
                        return extended.global.moment;
                    },
                    numeral: function() {
                        return extended.global.numeral;
                    }
                };
            },
            directory: function() {
                return extended.directory;
            },
            debug: function() {
                return extended.debug;
            },
            supported: function() {
                return extended.supported;
            },
            default: function() {
                return extended.default;
            },
            router: function() {
                return extended.router;
            },
            keywords: function() {
                return extended.keywords;
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
