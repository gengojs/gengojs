/*jslint node: true, forin: true, jslint white: true, newcap: true*/
/*
 * config
 * author : Takeshi Iwana
 * https://github.com/iwatakeshi
 * license : MIT
 * Code heavily borrowed from Adam Draper
 * https://github.com/adamwdraper
 */

(function () {
    'use strict';

    var config,
        _ = require('underscore'),
        utils = require('./utils.js'),
        approot = require('app-root-path'),
        localemap = require('../maps/locales.js'),
        hasModule = (typeof module !== 'undefined' && module.exports),
        defaults = {
            global: {
                //set gengo global variable
                gengo: "__"
            },
            //set path to locale
            directory: approot + '/locales/',
            //set to false; for debugging purposes
            debug: false || ['warn', 'info'],
            //set supported localemap
            supported: ['en-US'],
            //set default locale, which would be the locale used for your template of choice
            default: 'en-US',
            //set view aware
            router: false,
            extension: 'js',
            cookie: 'locale',
            keywords: {
                default: 'default',
                translated: 'translated',
                universe: 'gengo',
                plural: 'plural'
            }
        };

    config = function (config) {
        var extended = utils.Object(config).extend(defaults);
        return {
            global: function () {
                return {
                    gengo: function () {
                        return extended.global.gengo;
                    },
                    moment: function () {
                        return extended.global.moment;
                    },
                    numeral: function () {
                        return extended.global.numeral;
                    }
                };
            },
            directory: function () {
                var tempPath = extended.directory,
                    path;
                if (extended.directory.indexOf(approot) === -1) {

                    if (tempPath.indexOf('/') === 0) {
                        tempPath = tempPath.replace("/", "");
                    }
                    if (tempPath.slice(-1) !== '/') {
                        tempPath = tempPath + '/';
                    }
                    path = tempPath;
                    path = approot + "/" + path;
                } else {
                    path = tempPath;
                }
                return path;
            },
            debug: function () {
                return extended.debug;
            },
            supported: function () {
                var supported = [];
                _.each(extended.supported, function (item) {
                    item = item.toLowerCase();
                    if (item.indexOf('_') !== -1) {
                        item = item.replace('_', '-');
                    }
                    supported.push(localemap.gengo[item]);
                });
                return supported;
            },
            default: function () {
                extended.default = extended.default.toLowerCase();
                if (extended.default.indexOf('_') !== -1) {
                    extended.default = extended.default.replace('_', '-');
                }
                return localemap.gengo[extended.default];
            },
            cookie: function () {
                return extended.cookie;
            },
            router: function () {
                return extended.router;
            },
            extension: function () {
                return extended.extension;
            },
            keywords: function () {
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
        define([], function () {
            return config;
        });
    }
}).call(this);
