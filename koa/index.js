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
        extract = require(modules + 'extract/'),
        middleware = require(modules + 'middleware/'),
        config = require(modules + 'config/'),
        router = require(modules + 'router/'),
        localize = require(modules + 'localize/'),
        io = require(modules + 'io/'),
        parser = require(parsers + 'default/'),
        //npm modules
        _ = require('lodash'),
        accept = require('gengojs-accept'),
        Proto = require('uberproto'),
        hasModule = (typeof module !== 'undefined' && module.exports);

    /**
     * @class
     * @description gengo.js Constructor.
     * @this {Gengo}
     * @private
     */
    var Gengo = Proto.extend({
        /**
         * @method init
         * @description Initializes Gengo.
         * @private
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
         * @method parse
         * @description Calls all parsers for i18n.
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
         * @method koa
         * @description Enables Gengo to be a Koa middleware.
         * @param  {Koa}   koa  The context of Koa.
         * @private
         *
         */
        koa: function(koa) {
            //detect locale
            this.accept = accept(koa, {
                default: this.settings.default(),
                supported: this.settings.supported(),
                keys: this.settings.keys(),
                detect: this.settings.detect()
            });
            //set the global locale for localize
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
         * @method config
         * @description Sets the settings.
         * @private
         */
        config: function(opt) {
            this.settings = config(opt);
        },
        /**
         * @method use
         * @description Enables Gengo to accept a middleware parser.
         * @param  {Function} fn The middleware parser for Gengo to use.
         * @private
         */
        use: function(fn) {
            this.middlewares = middleware(fn);
        },
        /**
         * @method _mock
         * @description Test function for mocha tests.
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
         * @description Applies the API to an object.
         * @private
         */
        _apply: function() {
            var object = arguments[0] || arguments[1];
            var self = this;
            _.forEach(self._api(), function(item, key) {
                switch (key) {
                    case 'i18n':
                        _.forOwn(item, function(api, subkey) {
                            if (!object[subkey]) {
                                if (subkey === self.settings.globalID()) object[subkey] = api.bind(self);
                                else object[self.settings.globalID()][subkey] = api.bind(self);
                            } else console.warn('Global key already exists')
                        })
                        break;
                    case 'l10n':
                        _.forOwn(item, function(api, subkey) {
                            if (!object[subkey]) {
                                if (subkey === self.settings.localizeID()) object[subkey] = api.bind(self);
                            } else console.warn('Localize key already exists')
                        });
                        break;
                }

            });
        },
        /** 
         * @method _api
         * @description Sets the API.
         * @return {Object} The api for Gengo.
         * @private
         */
        _api: function() {
            var i18n = function() {}
            var l10n = function() {}
                /**
                 * @method i18n
                 * @description I18ns the arguments.
                 * Note: You can change ID for i18n. See Configuration.
                 * @param  {...*} arg The arguments to internationalize.
                 *
                 * @example <caption>Phrase notation with default parser.</caption>
                 *
                 * //assuming the locale === 'ja',
                 * //a basic phrase returns 'こんにちは'
                 * __('Hello');
                 *
                 * //a basic phrase with sprintf returns 'Bob こんにちは'
                 * __('Hello %s', 'Bob');
                 *
                 * //a basic phrase with interpolation returns 'Bob こんにちは'
                 *  __('Hello {{name}}', {name:'Bob'});
                 *
                 * @example <caption>Bracket notation with default parser.</caption>
                 *
                 * //assuming the locale === 'ja',
                 * //a basic bracket phrase returns 'おっす'
                 * __('[Hello].informal');
                 *
                 * //a basic bracket phrase with sprintf returns 'Bob おっす'
                 * __('[Hello %].informal', 'Bob');
                 *
                 * //a basic bracket phrase with interpolation returns 'Bob おっす'
                 * __('[Hello {{name}}].informal', {name:'Bob'});
                 *
                 * @example <caption>Dot notation with default parser.</caption>
                 *
                 * //assuming the locale === 'ja',
                 * //a basic dot phrase returns 'おっす'
                 * __('greeting.hello.informal');
                 *
                 * //a basic dot phrase with sprintf returns 'Bob おっす'
                 * __('greeting.hello.person.informal', 'Bob');
                 *
                 * //a basic dot phrase with interpolation returns 'Bob おっす'
                 * __('greeting.hello.person.informal', {name:'Bob'});
                 *
                 * @example <caption>All notations with Message Format.</caption>
                 * //See '{@link https://github.com/thetalecrafter/message-format|message-format}' for documentation.
                 *
                 * //assuming the locale === 'en-us',
                 * //a basic phrase with message formatting
                 * //returns "You took 4,000 pictures since Jan 1, 2015 9:33:04 AM"
                 * __('You took {n,number} pictures since {d,date} {d,time}', { n:4000, d:new Date() });
                 *
                 * //a basic bracket phrase with message formatting
                 * //returns "You took 4,000 pictures since Jan 1, 2015 9:33:04 AM"
                 * __('[You took {n, numbers} pictures].since.date', { n:4000, d:new Date() });
                 *
                 * //a basic dot phrase with message formatting
                 * //returns "You took 4,000 pictures since Jan 1, 2015 9:33:04 AM"
                 * __('pictures.since.date', { n:4000, d:new Date() });
                 *
                 * @return {String} Then i18ned string.
                 * @public
                 */

            i18n[this.settings.globalID()] = function(arg) {
                return this.parse(arg, extract(arguments), arguments.length)
            };
            /**
             * @method language
             * @description Returns the name of the current locale.
             * @param  {string} id The locale to change.
             *
             * @example <caption>Get the current language.</caption>
             *
             * //assuming locale === 'en-us'
             * //returns 'American English'
             * __.languages();
             *
             * @example <caption>Get the current language in another locale. </caption>
             *
             * //assuming locale === 'en-us'
             * //returns 'English'
             * __.language('en');
             *
             * //returns 'Japanese'
             * __.language('ja');
             *
             * @return {String} Then i18ned string.
             * @public
             */
            i18n.language = function(id) {
                //de-normalize locale
                var locale = this.accept.getLocale().replace('-', '_');
                //denormalize id
                id = id ? id.toLowerCase().replace('-', '_') : locale;
                //store the languages
                return cldr.extractLanguageDisplayNames(locale)[id];
            }
            /**
             * @method languages
             * @description Returns the names of the supported locale.
             * @param  {String | Array} arg The locale to change or the supported locales.
             * @param {Array} supported The supported locales.
             *
             * @example <caption>Get the supported languages.</caption>
             *
             * //assuming locale === 'en-us'
             * //returns ['American English', 'Japanese']
             * __.lanugages();
             *
             * @example <caption>Get the current languages in another locale. </caption>
             *
             * //assuming locale === 'en-us'
             * //returns ['アメリカ英語', '日本語']
             * __.languages('ja');
             *
             * @example <caption>Override the supported locales.</caption>
             *
             * //assuming locale === 'en-us'
             * //returns ['English', 'Japanese']
             * __.languages(['en', 'ja']);
             *
             * @example <caption>Override the supported locales and get the languages in another locale.</caption>
             *
             * //assuming locale === 'en-us'
             * //returns ['英語', '日本語']
             * __.languages('ja', ['en', 'ja']);
             *
             * @return {String} Then i18ned string.
             * @public
             */
            i18n.languages = function(arg, supported) {
                var _supported = [];
                supported = _.isArray(arg) ? arg : supported;
                arg = _.isArray(arg) ? undefined : arg;
                _.forEach(supported || this.settings.supported(), function(locale) {
                    //de-normalize locales
                    var locale = locale.replace('-', '_');
                    //denormalize arg
                    arg = arg ? arg.toLowerCase().replace('-', '_') : locale;
                    //store the languages
                    _supported.push(cldr.extractLanguageDisplayNames(arg)[locale]);
                }, this)
                return _supported;
            }

            /**
             * @method locale
             * @description Sets or gets the locale.
             * @param  {String} locale The locale to set or get.
             *
             * @example <caption>Get the current locale.</caption>
             *
             * //assuming locale === 'en-us'
             * //returns 'en-us'
             * __.locale()
             *
             * @example <caption>Set the locale.</caption>
             *
             * //asumming locale === 'en-us'
             * //sets and returns 'ja'
             * __.locale('ja')
             *
             * @return {String} The locale.
             * @public
             */
            i18n.locale = function() {
                return locale ? this.accept.setLocale(locale) : this.accept.getLocale();
            }

            /**
             * @method l10n
             * @description Localizes date, time and numbers.
             * See {@link https://github.com/iwatakeshi/tokei|Tokei} for documentation.
             * Note: You can change ID for l10n. See Configuration.
             * @param  {String}  locale The locale to override.
             * @return {Tokei} The instance of Tokei.
             * @public
             */
            l10n[this.settings.localizeID()] = function() {
                return this.localize.apply(this, arguments);
            };

            return {
                i18n: i18n,
                l10n: l10n
            };
        }
    }).create();

    /**
     * @method gengo
     * @description Main function for Gengo.
     * @param  {Object} opt The configuration options.
     * @return {Function}   The middleware for Koa.
     * @public
     */
    function gengo(opt) {
        Gengo.config(opt);
        return function * (next) {
            Gengo.koa.bind(Gengo)(this);
            yield next;
        }
    }

    /**
     * @method use
     * @description Adds parsers to Gengo.
     * @param  {Function} fn The middleware parser for Gengo to use.
     * @public
     */
    gengo.use = function(fn) {
        Gengo.use(fn);
    };

    /**
     * @method clone
     * @description Returns the i18n function.
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
     * @description Test Returns the i18n function.
     * @param  {(String | Object)} phrase Contains a string or Object to translate.
     * @return {Object}        The parser.
     * @private
     */
    gengo._mock = function(phrase) {
        return Gengo._mock(phrase, extract(arguments), arguments.length);
    };

    /**
     * version
     * @type {String}
     * @public
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