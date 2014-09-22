/*jslint node: true, forin: true, jslint white: true, newcap: true*/
/*global console*/
/*
 * locale
 * author : Takeshi Iwana
 * https://github.com/iwatakeshi
 * license : MIT
 * Code heavily borrowed from Adam Draper
 * https://github.com/adamwdraper
 */

(function() {
    'use strict';

    var locale,
        _ = require('underscore'),
        jed = require('locale'),
        config = require('./config.js'),
        utils = require('./utils.js'),
        debug = utils.debug,
        isDefined = utils.isDefined,
        supported,
        bestmatch,
        requested,
        gengo,
        cookie = require('./cookie.js'),
        router = require('./router.js'),
        hasModule = (typeof module !== 'undefined' && module.exports);
    locale = function(gengoapp) {
        if (gengoapp) {
            gengo = gengoapp;
        }

        return {
            supported: function() {
                return supported;
            },
            requested: function() {
                return requested;
            },
            default: function() {
                return config().default();
            },
            bestmatch: function() {
                debug(bestmatch).debug("module: locale, fn: locale, Current best match is:");
                return bestmatch;
            }
        };
    };

    locale.init = function(req, res, next) {
        supported = new jed.Locales(config().supported());
        var locales = new jed.Locales(req.headers["accept-language"]);
        requested = req.headers['accept-language'];
        debug(requested).data("module: locale, fn: init, Accept-Language is:");
        bestmatch = locales.best(supported);
        debug(bestmatch).data("module: locale, fn: init, Best match is:");
        res.locals[config().global().gengo()] = gengo;
        cookie().init(req);
        router().init(req);
        if (_.isFunction(next) && isDefined(next)) {
            return next();
        }
    };

    /************************************
        Exposing locale
    ************************************/

    // CommonJS module is defined
    if (hasModule) {
        module.exports = locale;
    }

    /*global ender:false */
    if (typeof ender === 'undefined') {
        // here, `this` means `window` in the browser, or `global` on the server
        // add `locale` as a global object via a string identifier,
        // for Closure Compiler 'advanced' mode
        this.locale = locale;
    }

    /*global define:false */
    if (typeof define === 'function' && define.amd) {
        define([], function() {
            return locale;
        });
    }
}).call(this);
