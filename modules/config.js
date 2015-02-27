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
var path = require('path');
var S = require('string');

var config = Proto.extend({
    init: function(opt) {
        this.set(opt);
        return this;
    },
    set: function(opt) {
        var result;
        if (_.isString(opt)) result = this._read(opt);
        else result = this._read('../settings.json');
        this.settings = {};
        this.settings = _.assign(this.settings, result);
        if (_.isPlainObject(opt)) this.settings = _.assign(this.settings, opt);
    },
    //todo:mocha
    detect: function() {
        var self = this;
        return {
            query: function() {
                return self.settings.detect.query || false;
            },
            subdomain: function() {
                return self.settings.detect.subdomain || false;
            },
            cookie: function() {
                return self.settings.detect.cookie || false;
            },
            header: function() {
                return self.settings.detect.header || true;
            },
            url: function() {
                return self.settings.detect.url || false;
            }
        };
    },
    //todo:mocha
    keys: function() {
        var self = this;
        return {
            cookie: function() {
                return self.settings.keys.cookie || 'locale';
            },
            query: function() {
                return self.settings.keys.query || 'locale';
            }
        };
    },
    configuration: function() {
        return this.settings;
    },
    id: function() {
        return this.settings.global;
    },
    directory: function() {
        var dir = this.settings.directory;
        //http://nodejs.org/docs/latest/api/path.html#path_path_isabsolute_path
        if (!utils.isAbsolute(dir)) {
            // ./x-dir ?
            if (S(dir).include('./')) {
                dir = dir.replace('.', '');
            }
            dir = path.normalize(path.join(root, dir));
        } else {
            // /x-dir?
            if (!S(dir).include(root)) {
                dir = path.normalize(path.join(root, dir));
            }
        }

        this.settings.directory = dir;
        return this.settings.directory;
    },
    supported: function() {
        var supported = this.settings.supported;
        var result = [];
        if (_.isString(supported)) result.push(supported);
        else result = supported;

        _.forEach(result, function(item, index) {
            result[index] = utils.normalize(item);
        });
        this.settings.supported = result;
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
        return '.' + utils.normalize(this.settings.extension).replace('.', '').replace('yaml', 'yml');
    },
    keywords: function() {
        var keywords = this.settings.keywords;
        this.settings.keywords = _.defaults(keywords || {}, {
            default: 'default',
            translated: 'translated',
            global: 'global',
            singular: 'singular',
            plural: 'plural',
        });
        return this.settings.keywords;
    },
    prefix: function() {
        return this.settings.prefix;
    },
    template: function() {
        var template = this.settings.template;
        this.settings.template = _.defaults(template || {}, {
            open: '{{',
            close: '}}'
        });
        return this.settings.template;
    },
    _read: function(filepath) {
        if (S(filepath).include('.json')) {
            return require(path.normalize(filepath));
        } else throw new Error('The configuration must be a JSON file.')
    }
});

module.exports = function(opt) {
    return config.create(opt);
};
