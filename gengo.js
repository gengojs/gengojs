/*jslint node: true, forin: true, jslint white: true, newcap: true*/
/*
 * gengojs
 * version : 0.3.61
 * author : Takeshi Iwana aka iwatakeshi
 * https://github.com/iwatakeshi
 * license : MIT
 * Code heavily inspired by:
 *        Adam Draper
 * https://github.com/adamwdraper
 *            &
 *      Marcus Spiegel
 * https://github.com/mashpie
 */

(function() {
    "use strict";
    //main functions
    var version = '1.0.0',
        //gengo modules
        extract = require('./modules/extract'),
        middleware = require('./modules/middleware'),
        filter = require('./modules/filter'),
        Proto = require('uberproto'),
        //npm modules
        mustache = require('mustache'),
        vsprintf = require('sprintf-js').vsprintf,
        _ = require('lodash'),
        hasModule = (typeof module !== 'undefined' && module.exports);

    /**
     * Top level functions
     */

    /**
     * gengo Constructor
     * @param {String || Object} phrase Contains a string or Object to translate
     * @param {Object || Array} other  Contains the values or sprintf arguments.
     * @api private
     */

    var Gengo = Proto.extend({
        init: function() {
            this.result = '';
            this.settings = {
                parser: 'default'
            };
            this.middlewares = null;
            //number of arguments
            this.length = 0;
        },
        parse: function(phrase, other, length) {
            this.length = length;
            this.build(phrase, other);
            if (this.settings.parser === 'default') {
                //add default parser
            }

            if (this.middlewares) {
                this.middlewares.stack.forEach(function(fn) {
                    fn.bind(this)();
                }, this);
            }

            return this;
        },
        build: function(phrase, other) {
            var f = filter(phrase, other.values(), other.args(), this.length);
            this.phrase = f.phrase;
            this.values = f.values;
            this.args = f.args;
            this.template = f.template || {};
        },
        express: function(req, res, next) {
            next();
        },
        set: function(type, value) {
            this.settings[type] = value;
        },
        use: function(fn) {
            this.middlewares = middleware(fn);
        },
        //for mocha tests
        mock: function(phrase, other, length) {
            this.parse(phrase, other, length);
            return this;
        }
    }).create();


    /**
     * gengo factory
     * @param  {String || Object} phrase Contains a string or Object to translate
     * @return {String}        The translated phrase
     */
    function gengo(phrase) {
        return Gengo.parse(phrase, extract(arguments), arguments.length);
    };

    /**
     * Static API functions
     */

    /**
     * 'use' is a middleware handler that allows developers to
     *  append their own parser into gengo.js
     * @param  {Function} fn The parser to use
     * @api public
     */
    gengo.use = function(fn) {
        Gengo.use(fn);
    };

    gengo.init = function(req, res, next) {
        Gengo.express(req, res, next);
    }

    /**
     * '__mock' is a function used for mocha tests
     * @param  {String || Object} phrase Contains a string or Object to translate
     * @return {Object}        Gengo's 'this' object
     * @api private
     */
    gengo.__mock = function(phrase) {
        return Gengo.mock(phrase, extract(arguments), arguments.length);
    };


    /**
     * Expose Gengo
     */

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
