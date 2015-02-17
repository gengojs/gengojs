/*jslint node: true, forin: true, jslint white: true, newcap: true*/
'use strict';

var Proto = require("uberproto");
var _ = require('lodash');

function normalize(str) {
    var str = str.toLowerCase();
    if (str.indexOf('_') > -1) {
        str = str.replace('_', '-');
    }
    return str;
}
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
        prefix: ""
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
        if (!path.isAbsolute(dir)) {
            // ./x-dir ?
            if (dir.indexOf('./') > -1) {
                dir = dir.replace('.', '');
            }
            dir = path.normalize(path.join(root, dir));
        } else {
            // /x-dir?
            if (!(dir.indexOf(root) > -1)) {
                dir = path.normalize(path.join(root, dir))
            }
        }

        this.settings.directory = dir;
        return this.settings.directory;
    },
    supported: function() {
        var supported = this.settings.supported;
        _.forEach(supported, function(item, index) {
            supported[index] = normalize(item);
        });
        this.settings.supported = supported;
        return this.settings.supported;
    },
    default: function() {
        return normalize(this.settings.default);
    },
    isRouter: function() {
        return this.settings.router;
    },
    isMarkdown: function() {
        return this.settings.markdown;
    },
    extension: function() {
        return '.' + normalize(this.settings.extension).replace('.', '');
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
    }
});

module.exports = function(opt) {
    return config.create(opt);
};
