/*jslint node: true, forin: true, jslint white: true, newcap: true*/
/*global console*/
/*
 * cookie
 * author : Takeshi Iwana
 * https://github.com/iwatakeshi
 * license : MIT
 * Code heavily borrowed from Adam Draper
 * https://github.com/adamwdraper
 */

(function() {
    'use strict';

    var cookie,
        current,
        isSet,
        utils = require('./utils.js'),
        isDefined = utils.isDefined,
        debug = utils.debug,
        hasModule = (typeof module !== 'undefined' && module.exports);

    cookie = function() {
        return {
            locale: function() {
                debug(current).debug("module: cookie, fn: cookie, Current cookie");
                return current;
            },
            isSet: function() {
                return isSet;
            },
            init: function(req) {
                if (req.cookies) {
                    if (isDefined(req.cookies.locale)) {
                        debug(req.cookies.locale).debug("module: cookie, fn: cookie, Cookie's locale");
                        current = req.cookies.locale;
                        isSet = true;
                    } else {
                        isSet = false;
                    }
                }
            }
        };
    };


    /************************************
        Exposing cookie
    ************************************/

    // CommonJS module is defined
    if (hasModule) {
        module.exports = cookie;
    }

    /*global ender:false */
    if (typeof ender === 'undefined') {
        // here, `this` means `window` in the browser, or `global` on the server
        // add `cookie` as a global object via a string identifier,
        // for Closure Compiler 'advanced' mode
        this.cookie = cookie;
    }

    /*global define:false */
    if (typeof define === 'function' && define.amd) {
        define([], function() {
            return cookie;
        });
    }
}).call(this);
