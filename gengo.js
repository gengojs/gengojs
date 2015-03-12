/*jslint node: true, forin: true, jslint white: true, newcap: true, curly: false*/
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
        config = require(modules + 'config'),
        router = require(modules + 'router'),
        localize = require(modules + 'localize/'),
        parser = require(modules + 'parser/'),
        io = require(modules + 'io'),
        //npm modules
        _ = require('lodash'),
        accept = require('gengojs-accept'),
        Proto = require('uberproto'),
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
            this.router = router();
            this.io = io();
            this.settings = config();
            this.parser = {};
            this.isMock = false;
        },
        parse: function(phrase, other, length) {
            this.phrase = phrase;
            this.other = other;
            this.length = length;
            //are we testing gengo?
            if (!this.isMock) {
                this.io.set({
                    directory: this.settings.directory(),
                    name: this.accept.detectLocale(),
                    prefix: this.settings.prefix(),
                    extension: this.settings.extension()
                });

                if (!this.middlewares) this.use(parser());

                this.middlewares.stack.forEach(function(fn) {
                    fn.bind(this)();
                }, this);
            }
            return this.result;
        },
        express: function(req, res, next) {
            //detect locale
            this.accept = accept(req, {
                default: this.settings.default(),
                supported: this.settings.supported(),
                keys: this.settings.keys(),
                detect: this.settings.detect()
            });
            //set localize
            this.localize = localize;
            this.localize.locale(this.accept.detectLocale());
            //set the router
            this.router.set(this.accept.request);
            //apply the API to req || res
            if (_.isObject(this.accept.request)) this._apply(this.accept.request, res);
            if (_.isFunction(next)) next();
        },
        config: function(opt) {
            this.settings = config(opt);
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
            return this.parse(phrase, other, length);
        },
        _apply: function(req, res) {
            var object = req || res;
            if (!object[this.settings.id()]) {
                object[this.settings.id()] = function(parse) {
                    return Gengo.parse(parse, extract(arguments), arguments.length);
                };
            }
            if (!object.getLocale) {
                object.getLocale = function() {
                    return Gengo.accept.getLocale();
                };
            }
            if (!object.__l) {
                object.__l = function() {
                    return Gengo.localize.apply(this, arguments);
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
    }

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
