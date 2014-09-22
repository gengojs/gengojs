/*jslint node: true, forin: true, jslint white: true, newcap: true*/
/*global console*/
/*
 * gengojs
 * version : 0.2.17
 * author : Takeshi Iwana
 * https://github.com/iwatakeshi
 * license : MIT
 * Code heavily borrowed from Adam Draper
 * https://github.com/adamwdraper
 */

(function() {
    'use strict';

    var gengo,
        VERSION = '0.2.17',
        utils = require('./modules/utils.js'),
        _ = require('underscore'),
        core = require('./modules/core.js'),
        config = require('./modules/config.js'),
        locale = require('./modules/locale.js'),
        langs = require('./maps/langs.js'),
        hasModule = (typeof module !== 'undefined' && module.exports);
    /*
     * Types
     * __("") - arg2 = undefined
     * __("", 2) - arg2 = number
     * __({locale: 'ja', phrase: 'Hello'}, {mustache}) - arg2 = object
     * __("", ["hello"]) - arg2 = array
     * __("", 'hello') - arg2 = string

     */


    gengo = function(phrase) {
        var values, args = [];

        var array = Array.prototype.slice.call(arguments, 1);
        if (array.length > 1) {
            _.each(array, function(item) {
                args.push(item);
            });
            values = {};
        }

        if (array.length === 1) {
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
        return core(phrase, values, args);
    };

    gengo.config = function(configuration) {
        config(configuration);
        //to prevent require from looping pass a reference
        //of config to utils
        utils(config);
        locale(gengo);
    };
    gengo.locale = core.locale;
    gengo.language = function() {
        return langs[core.locale()];
    };
    gengo.init = locale.init;

    gengo.version = VERSION;

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
