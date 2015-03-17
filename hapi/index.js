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
    var version = require('../package').version,
        //path to modules
        modules = '../modules/',
        parsers = '../parser/',
        //gengo modules
        extract = require(modules + 'extract'),
        middleware = require(modules + 'middleware'),
        config = require(modules + 'config'),
        router = require(modules + 'router'),
        localize = require(modules + 'localize/'),
        io = require(modules + 'io'),
        parser = require(parsers + 'default/'),
        //npm modules
        _ = require('lodash'),
        accept = require('gengojs-accept'),
        Proto = require('uberproto'),
        hasModule = (typeof module !== 'undefined' && module.exports);

    /**
     * @class
     * @description gengo.js Constructor.
     * @private
     */
    var Gengo = Proto.extend({
        /**
         * @method init
         * @description 'init' is a function that initializes Gengo.
         * @private
         */
        init: function() {
            this.result = '';
            this.router = router();
            this.io = io();
            this.settings = config();
            this.isMock = false;
            //set localize
            this.localize = localize;
        },
        /**
         * @method parse
         * @description 'parse' is a function that calls all parsers for i18n.
         * @param  {(String | Object)} phrase The phrase or object (ex {phrase:'',locale:'en'}) to parse.
         * @param  {Object} other  The arguments and values extracted when 'arguments' > 1.
         * @param  {Number} length The number of 'arguments'.
         * @return {String}        The i18ned string.
         * @private
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
         * @method hapi
         * @description 'hapi' is a function that enables Gengo to be an Express middleware.
         * @param  {Object}   req  The request object.
         * @private
         * 
         */
        hapi: function(req) {
            //detect locale
            this.accept = accept(req, {
                default: this.settings.default(),
                supported: this.settings.supported(),
                keys: this.settings.keys(),
                detect: this.settings.detect()
            });

            this.localize.locale(this.accept.detectLocale());
            //set the router
            this.router.set(this.accept.request);
            //apply the API to req
            this._apply(req);
        },
        /** 
         * @method config
         * @description 'config' is a function that that sets the settings.
         * @private
         */
        config: function(opt) {
            this.settings = config(opt);
        },
         /**
         * @method use
         * 'use' is a function that enables Gengo to accept a middleware parser.
         * @param  {Function} fn The middleware parser for Gengo to use.
         * @private
         */
        use: function(fn) {
            this.middlewares = middleware(fn);
        },
        /**
         * @method _mock
         * @description '_mock' is a test function for mocha tests.
         * @param  {(String | Object)} phrase The phrase to parse.
         * @param  {*} other  Arguments.
         * @param  {Number} length The length of arguments.
         * @return {Object}        The context of Gengo.
         * @private
         */
        _mock: function(phrase, other, length) {
            this.isMock = true;
            return this.parse(phrase, other, length);
        },
        /** 
         * @method _apply
         * @description '_apply' is a function that applies the api to an object.
         * @private
         */
        _apply: function() {
            var object = arguments[0] || arguments[1];
            _.forOwn(this._api(), function(fn, key) {
                if (!object[key]) object[key] = fn.bind(this);
            }, this);
        },
        /** 
         * @method _api
         * @description '_api' is a function that sets the api.
         * @return {Object} The api for Gengo.
         * @private
         */
        _api: function() {
            var api = {};
            api[this.settings.globalID()] = function parser(parse) {
                return Gengo.parse(parse, extract(arguments), arguments.length);
            };
            api[this.settings.localizeID()] = function() {
                return Gengo.localize.apply(this, arguments);
            };
            api['locale'] = function() {
                return Gengo.accept.getLocale();
            };
            return api;
        }
    }).create();

    /**
     * @method gengo
     * @description 'gengo' is the main function for Gengo.
     * @param {Object} plugin The hapi plugin.
     * @param  {Object} opt The configuration options.
     * @param {Function} next The next function.
     * @public
     */
    function gengo(plugin, opt, next) {
        Gengo.config(opt);
        plugin.ext('onPreHandler', function(request, reply) {
            Gengo.hapi.bind(Gengo)(request);
            reply.continue();
        });

        plugin.ext('onPreResponse', function(request, reply) {
            Gengo.hapi.bind(Gengo)(request);
            var source = request.response.source;

            // Attach interface only if we got a view
            if (request.response.variety === 'view') {
                Gengo.hapi.bind(Gengo)(request);
                //bind the api to the context
                Gengo._apply(source.context);
            }
            reply.continue();
        });

        next();
    }

    /**
     * @method use
     * @description 'use' is a function that enables Gengo to accept a middleware parser.
     * @param  {Function} fn The middleware parser for Gengo to use.
     * @public
     */
    gengo.use = function(fn) {
        Gengo.use(fn);
    };

    /**
     * @method clone
     * @description 'clone' creates a copy of the main parse function.
     * @return {Function} The parser.
     * @public
     */
    gengo.clone = function() {
        return function(phrase) {
            return Gengo.parse(phrase, extract(arguments), arguments.length);
        };
    };

    /**
     * @method _mock
     * @description '__mock' is a function used for mocha tests.
     * @param  {(String | Object)} phrase Contains a string or Object to translate.
     * @return {Object}        The parser.
     * @private
     */
    gengo._mock = function(phrase) {
        return Gengo._mock(phrase, extract(arguments), arguments.length);
    };

    /**
     * version.
     * @type {String}
     * @public
     */
    gengo.version = version;

    // CommonJS module is defined
    if (hasModule) {
        /**
         * @method hapi
         * @description 'hapi' is a gengo plugin for Hapi.
         * @param  {(Object | String)} opt The configuration for Gengo.
         * @return {Object}     gengo.
         * @public
         */
        module.exports = function hapi(opt) {
            var register = gengo;
            register.attributes = {
                name: require('../package').name
            };
            return {
                register: register,
                options: opt || {}
            };
        }
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
