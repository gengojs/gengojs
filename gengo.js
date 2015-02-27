/*jslint node: true, forin: true, jslint white: true, newcap: true*/
/*
 * gengojs
 * version : 1.0.0
 * author : Takeshi Iwana aka iwatakeshi
 * https://github.com/iwatakeshi
 * license : MIT
 * Code heavily inspired by :
 *        Adam Draper
 * https://github.com/adamwdraper
 *            &
 *      Marcus Spiegel
 * https://github.com/mashpie
 */
(function() {
    "use strict";
    var version = '1.0.0',
        //path to modules
        modules = './modules/',
        //gengo modules
        extract = require(modules + 'extract'),
        middleware = require(modules + 'middleware'),
        filter = require(modules + 'filter'),
        config = require(modules + 'config'),
        router = require(modules + 'router'),
        store = require(modules + 'store'),
        parser = require(modules + 'parser'),
        io = require(modules + 'io'),
        accept = require('gengojs-accept'),
        Proto = require('uberproto'),
        //npm modules
        _ = require('lodash'),
        hasModule = (typeof module !== 'undefined' && module.exports);

    /**
     * gengo Constructor
     * @param {String || Object} phrase Contains a string or Object to translate
     * @param {Object || Array} other  Contains the values or sprintf arguments.
     * @api private
     */
    var Gengo = Proto.extend({
        init: function() {
            this.result = '';
            this.length = 0;
            this.settings = config();
            this.accept = accept();
            this.router = router();
            this.io = io();
            this.store = store();
            this.parser = {};
            this.isMock = false;
        },
        parse: function(phrase, other, length) {
            this.length = length;
            this.build(phrase, other);
            if (!this.isMock) {
                this.io.set({
                    directory: this.settings.directory(),
                    name: this.accept.detectLocale(),
                    prefix: this.settings.prefix(),
                    extension: this.settings.extension()
                });
                if (!this.middlewares) {
                    this.use(parser());
                }

                this.middlewares.stack.forEach(function(fn) {
                    fn.bind(this)();
                }, this);
            }
            return this.result;
        },
        build: function(phrase, other) {
            var f = filter(phrase, other.values(), other.args(), this.length);
            this.phrase = f.phrase;
            this.values = f.values;
            this.args = f.args;
            this.template = f.template || {};
        },
        express: function(req, res, next) {
            this.accept.set(req, {
                default: this.settings.default(),
                supported: this.settings.supported(),
                keys: {
                    cookie: this.settings.keys().cookie(),
                    query: this.settings.keys().query()
                },
                detect: {
                    header: this.settings.detect().header(),
                    cookie: this.settings.detect().cookie(),
                    query: this.settings.detect().query(),
                    url: this.settings.detect().url()
                }
            });
            this.router.set(this.accept.request);

            if (_.isObject(this.accept.request)) this._apply(this.accept.request, res);

            if (_.isFunction(next)) next();
        },
        config: function(opt) {
            this.settings.set(opt);
        },
        use: function(fn) {
            this.middlewares = middleware(fn);
        },
        /**
         * Parse function for mocha tests
         * @param  {String, Object} phrase The phrase to parse
         * @param  {String, Object, Array, Number} other  Arguments
         * @param  {Number} length The length of arguments
         * @return {Object}        The context of Gengo
         * @api private
         */
        _mock: function(phrase, other, length) {
            this.isMock = true;
            this.parse(phrase, other, length);
            return this;
        },
        _apply: function(req, res) {
            var object = req || res;
            if (!object[this.settings.id()]) {
                object[this.settings.id()] = function(parse) {
                    return Gengo.parse(parse, extract(arguments), arguments.length);
                };
            }
            if (!object['getLocale']) {
                object.getLocale = function() {
                    return Gengo.accept.getLocale();
                }
            }
        }
    }).create();

    /**
     * main gengo function
     * @param  {Object} opt The configuration options
     * @return {Function}   The middleware for express.
     */
    function gengo(opt) {
        Gengo.config(opt);
        return Gengo.express.bind(Gengo);
    };

    /**
     * 'use' is a middleware handler that allows developers to
     *  append their own parser into gengo.js
     * @param  {Function} fn The parser to use
     * @api public
     */
    gengo.use = function(fn) {
        Gengo.use(fn);
    };

    /**
     * 'clone' creates a copy of the main parse function.
     * @return {Function} The main function without options
     * @api public
     */
    gengo.clone = function() {
        return function(phrase) {
            return Gengo.parse(phrase, extract(arguments), arguments.length);
        };
    };

    /**
     * '__mock' is a function used for mocha tests
     * @param  {String || Object} phrase Contains a string or Object to translate
     * @return {Object}        Gengo's 'this' object
     * @api private
     */
    gengo._mock = function(phrase) {
        return Gengo._mock(phrase, extract(arguments), arguments.length);
    };

    /**
     * gengo's version
     * @type {String}
     */
    gengo.version = version;

    // CommonJS module is defined
    if (hasModule) {
        module.exports = gengo;
    }

    /*global ender:false */
    if (typeof ender === 'undefined') {
        this.gengo = gengo;
    }

    /*global define:false */
    if (typeof define === 'function' && define.amd) {
        define([], function() {
            return gengo;
        });
    }
}).call(this);
