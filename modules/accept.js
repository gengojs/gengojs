/*jslint node: true, forin: true, jslint white: true, newcap: true, curly: false*/
/**
 * Takeshi Iwana aka iwatakeshi
 * MIT 2015
 * accept-language.js
 * This module parses the accept-language header
 * and returns the approriate locale.
 * Credits to @fundon
 * https://github.com/koa-modules/koa-locale/blob/master/index.js
 */
'use strict';
var Proto = require('uberproto');
var url = require('url');
var cookie = require('cookie');

var accept = Proto.extend({
    init: function(req, opt) {

        var defaults = {
            default: 'en-US',
            supported: ['en-US']
        };

        this.opt = opt ? {
            default: opt.default || defaults.default,
            supported: opt.supported || defaults.supported
        } : defaults;

        if (req) {
            this['accept-language'] = '';
            //koa?
            if (req.request) {
                this.isKoa = true;
                this.koa = req;
                this.request = req.request;
                this.header = this.request.header;
                this.cookie = this.header.cookie || this.header.cookies;
            } else {
                this.isKoa = false;
                this.koa = null;
                this.request = req;
                this.header = this.request.headers;
                this.cookie = this.header.cookie || this.header.cookies;
            }
            this.guess();
        }

        return this;
    },
    getAcceptLanguage: function(req) {
        if (req) this['accept-language'] = req.header['accept-language'] || req.headers['accept-language'] || '';
        else this['accept-language'] = this.request.header['accept-language'] || this.request.headers['accept-language'] || '';
        return this['accept-language'];
    },
    getLocale: function() {
        return this.locale;
    },
    // From accept-language, `Accept-Language: ja`
    guess: function(req) {
        this.getAcceptLanguage();

        var reg = /(^|,\s*)([a-z-0-9-]+)/gi,
            match, locale;
        while ((match = reg.exec(this['accept-language']))) {
            if (!locale) {
                locale = match[2];
            }
        }

        this.locale = this.opt.supported[this.opt.supported.indexOf(locale)] || this.opt.default;
        return this.locale;
    },
    // From query, 'lang=en'
    getFromQuery: function(key) {
        var query;
        if (this.isKoa) query = this.request.query;
        else query = url.parse(this.request.url, true).query;
        this.locale = query ? (query[key] || this.guess()) : this.guess();
        return this.locale;
    },
    // From subdomain, 'en.gengojs.com'
    getFromSubdomain: function() {
        if (this.isKoa) this.locale = this.request.subdomains[0] || this.guess();
        else this.locale = this.request.headers.host.split('.')[0] || this.guess();
        return this.locale;
    },
    // From cookie, 'lang=ja'
    getFromCookie: function(key) {
        if (this.isKoa)
            this.locale = this.cookie ? (cookie.parse(this.cookie)[key] || this.guess()) : this.guess();
        else
            this.locale = this.cookie ? (cookie.parse(this.cookie)[key] || this.guess()) : this.guess();
        return this.locale;
    },
    // From URL, 'http://gengojs.com/en'
    getFromUrl: function() {
        var locale = this.request.path.substring(1).split('/').shift();
        var index = this.opt.supported.indexOf(locale);
        locale = this.opt.supported[index] || this.guess();
        this.locale = locale;
        return this.locale;
    }
});

module.exports = function(req, opt) {
    return accept.create(req, opt);
};
