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
        modules = '../modules/',
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
     * @constructor
     * @private
     * @api   private
     */
    var Gengo = Proto.extend({
        /**
         * 'init' is a function that initializes Gengo
         * @private
         * @api private
         */
        init: function() {
            this.result = '';
            this.router = router();
            this.io = io();
            this.settings = config();
            this.isMock = false;
            this.localize = localize;
        },
        /**
         * 'parse' is a function that calls all parsers for i18n.
         * @private
         * @param  {String, Object} phrase The phrase or object (ex {phrase:'',locale:'en'}) to parse.
         * @param  {Object} other  The arguments and values extracted when 'arguments' > 1
         * @param  {Number} length The number of 'arguments'
         * @return {String}        The i18ned string.
         * @api    private
         */
        parse: function(phrase, other, length) {
            this.phrase = phrase;
            this.other = other;
            this.length = length;
            //are we testing Gengo?
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
        /**
         * 'express' is a function that enables Gengo to be an Express middleware.
         * @private
         * @param  {Object}   req  The request object
         * @param  {Object}   res  The response object
         * @param  {Function} next The next function
         * @api    private
         */
        koa: function(koa) {
            //detect locale
            this.accept = accept(koa, {
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
            this._apply(koa.request, koa.response);
            //the original req and res may exist
            if (koa.req || koa.res) this._apply(koa.req, koa.res);
            //for convenience
            this._apply(koa);
            //apply to state
            this._apply(koa.state);
        },
        /** 
         * 'config' is a function that that sets the settings.
         * @private
         * @api   private
         */
        config: function(opt) {
            this.settings = config(opt);
        },
        /**
         * 'use' is a function that enables Gengo to accept a middleware parser.
         * @param  {Function} fn The middleware parser for Gengo to use.
         * @api    private
         */
        use: function(fn) {
            this.middlewares = middleware(fn);
        },
        /**
         * '_mock' is a test function for mocha tests
         * @private
         * @param  {String, Object} phrase The phrase to parse
         * @param  {String, Object, Array, Number} other  Arguments
         * @param  {Number} length The length of arguments
         * @return {Object}        The context of Gengo
         * @api    private
         */
        _mock: function(phrase, other, length) {
            this.isMock = true;
            return this.parse(phrase, other, length);
        },
        /** 
         * '_apply' is a function that applies the api to an object.
         * @private
         * @api    private
         */
        _apply: function() {
            var object = arguments[0] || arguments[1];
            _.forOwn(this._api(), function(fn, key) {
                if (!object[key]) object[key] = fn.bind(this);
            }, this);
        },
        /** 
         * '_api' is a function that sets the api
         * @private
         * @return {Object} The api for Gengo
         * @api    private
         */
        _api: function() {
            var api = {};
            api[this.settings.globalID()] = function parser(parse) {
                return this.parse(parse, extract(arguments), arguments.length);
            };
            api[this.settings.localizeID()] = function() {
                return this.localize.apply(this, arguments);
            };
            api['locale'] = function() {
                return this.accept.getLocale();
            };
            return api;
        }
    }).create();

    /**
     * 'gengo' is the main function for Gengo
     * @public
     * @param  {Object} opt The configuration options
     * @return {Function}   The middleware for express.
     * @api    public
     */
    function gengo(opt) {
        Gengo.config(opt);
        return function*(next) {
            Gengo.koa.bind(Gengo)(this);
            yield next;
        }
    }

    /**
     * 'use' is a function that enables Gengo to accept a middleware parser.
     * @public
     * @param  {Function} fn The middleware parser for Gengo to use.
     * @api    public
     */
    gengo.use = function(fn) {
        Gengo.use(fn);
    };

    /**
     * 'clone' creates a copy of the main parse function.
     * @public
     * @return {Function} The main function without options
     * @api    public
     */
    gengo.clone = function() {
        return function(phrase) {
            return Gengo.parse(phrase, extract(arguments), arguments.length);
        };
    };

    /**
     * '__mock' is a function used for mocha tests.
     * @private
     * @param  {String || Object} phrase Contains a string or Object to translate
     * @return {Object}        Gengo's 'this' object
     * @api private
     */
    gengo._mock = function(phrase) {
        return Gengo._mock(phrase, extract(arguments), arguments.length);
    };

    /**
     * gengo's version.
     * @public
     * @type {String}
     */
    gengo.version = version;

    // CommonJS module is defined
    if (hasModule) {
        //@private
        module.exports = gengo;
    }

    /*global ender:false */
    if (typeof ender === 'undefined') {
        //@private
        this.gengo = gengo;
    }

    /*global define:false */
    if (typeof define === 'function' && define.amd) {
        define([], function() {
            return gengo;
        });
    }
}).call(this);
