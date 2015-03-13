/*jslint node: true, forin: true, jslint white: true, newcap: true, curly: false*/
/*
 * localize
 * author : Takeshi Iwana
 * https://github.com/iwatakeshi
 * license : MIT
 */

(function() {
    'use strict';
    var localize,
        global = {
            locale: 'en-US'
        },
        Proto = require('uberproto'),
        //Intl = Intl || require('intl'),
        Intl = require('intl'),
        _ = require('lodash'),
        cldr = require('cldr'),
        moment = require('moment-timezone'),
        hasModule = (typeof module !== 'undefined' && module.exports);


    var Localize = Proto.extend({
        init: function(locale) {
            this._date = new Date();
            this._locale = locale || global.locale;
            //set moment
            this._moment = moment;
            //set moment to global locale
            this._moment.locale(this._locale);
            return this;
        },
        datetime: function() {
            switch (arguments.length) {
                case 0:
                    this._datetime = new Intl.DateTimeFormat(this._locale);
                    break;
                case 1:
                    this._datetime = new Intl.DateTimeFormat(_.isString(arguments[0]) ? arguments[0] : this._locale, _.isPlainObject(arguments[0]) ? arguments[0] : {});
                    break;
                default:
                    this._datetime = new Intl.DateTimeFormat(arguments[0], arguments[1]);
                    break;
            }
            return this;
        },
        number: function() {
            switch (arguments.length) {
                case 0:
                    this._number = new Intl.NumberFormat(this._locale);
                    break;
                case 1:
                    this._number = new Intl.NumberFormat(_.isString(arguments[0]) ? arguments[0] : this._locale, _.isPlainObject(arguments[0]) ? arguments[0] : {});
                    break;
                default:
                    this._number = new Intl.NumberFormat(arguments[0], arguments[1]);
                    break;
            }
            return this;
        },
        format: function() {
            if (this._number)
                return this._number.format.apply(this, arguments);
            else if (this._datetime)
                return this._datetime.format.apply(this, arguments);
            else return null;
        },
        moment: function() {
            return this._moment.apply(this, arguments);
        },
        cldr: function() {
            return cldr;
        }
    });


    localize = function(locale) {
        return Localize.create(locale);
    };

    localize.locale = function(locale) {
        global.locale = locale;
    }

    localize.moment = moment;

    // CommonJS module is defined
    if (hasModule) {
        module.exports = localize;
    }

    /*global ender:false */
    if (typeof ender === 'undefined') {
        // here, `this` means `window` in the browser, or `global` on the server
        // add `localize` as a global object via a string identifier,
        // for Closure Compiler 'advanced' mode
        this.localize = localize;
    }

    /*global define:false */
    if (typeof define === 'function' && define.amd) {
        define([], function() {
            return localize;
        });
    }
}).call(this);
