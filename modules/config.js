/*jslint node: true, forin: true, jslint white: true, newcap: true*/

/**
 * Takeshi Iwana aka iwatakeshi
 * MIT 2015
 * config.js
 * This module sets the user's preferences
 */

'use strict';

var Proto = require("uberproto");
var _ = require('lodash');
var utils = require('./utils');

var root = require('app-root-path').path;
var path = require('path'),
    defaults = {
        //global variables
        global: "__",
        //path to locale
        directory: path.normalize(path.join(root, '/locales')),
        //supported locales
        supported: ['en-US'],
        //default locale, which would be the locale used for your template of choice
        default: 'en-US',
        //route aware ?
        router: false,
        //enable markdown ?
        markdown: false,
        //template?
        template: {
            open: '{{',
            close: '}}'
        },
        //file extension
        extension: 'json',
        //cookie
        cookie: 'locale',
        //keywords
        keywords: {
            default: 'default',
            translated: 'translated',
            universe: 'gengo',
            plural: 'plural'
        },
        prefix: ''
    };

var config = Proto.extend({
    init: function(opt) {
        this.settings = _.assign(_.extend(defaults, opt));
    },
    id: function() {
        return this.settings.global;
    },
    directory: function() {
        var dir = this.settings.directory;
        //http://nodejs.org/docs/latest/api/path.html#path_path_isabsolute_path
        if (!utils.isAbsolute(dir)) {
            // ./x-dir ?
            if (dir.indexOf('./') > -1) {
                dir = dir.replace('.', '');
            }
            dir = path.normalize(path.join(root, dir));
        } else {
            // /x-dir?
            if (dir.indexOf(root) <= -1) {
                dir = path.normalize(path.join(root, dir));
            }
        }



        this.settings.directory = dir;
        return this.settings.directory;
    },
    supported: function() {
        var supported = this.settings.supported;
        _.forEach(supported, function(item, index) {
            supported[index] = utils.normalize(item);
        });
        this.settings.supported = supported;
        return this.settings.supported;
    },
    default: function() {
        return utils.normalize(this.settings.default);
    },
    isRouter: function() {
        return this.settings.router;
    },
    isMarkdown: function() {
        return this.settings.markdown;
    },
    extension: function() {
        return '.' + utils.normalize(this.settings.extension).replace('.', '');
    },
    keywords: function() {
        var keywords = this.settings.keywords;
        this.settings.keywords = {
            default: keywords.default || 'default',
            translated: keywords.translated || 'translated',
            universe: keywords.universe || 'gengo',
            plural: keywords.plural || 'plural'
        };
        return this.settings.keywords;
    },
    prefix: function() {
        return this.settings.prefix;
    },
    template: function() {
        var template = this.settings.template;
        this.settings.template = {
            open: template.open || '{{',
            close: template.close || '}}'
        };
        return this.settings.template;
    }
});

module.exports = function(opt) {
    return config.create(opt);
};
