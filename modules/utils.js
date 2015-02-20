/*jslint node: true, forin: true, jslint white: true, newcap: true*/

/**
 * Takeshi Iwana aka iwatakeshi
 * MIT 2015
 * accept-language.js
 * This module contains a bunch
 * of convenience functions.
 */
'use strict';

var Proto = require('uberproto');
var _ = require('lodash');
var Path = require('path');

var utils = Proto.extend({
    init: function() {

    },
    flatten: function flatten(arr, ret) {
        ret = ret || [];
        var len = arr.length;
        for (var i = 0; i < len; ++i) {
            if (_.isArray(arr[i])) {
                exports.flatten(arr[i], ret);
            } else {
                ret.push(arr[i]);
            }
        }
        return ret;
    },
    normalize: function normalize(str) {
        var str = str.toLowerCase();
        if (str.indexOf('_') > -1) {
            str = str.replace('_', '-');
        }
        return str;
    },
    isInteger: function isInteger(value) {
        if (_.isString(value)) return false;

        if ((undefined === value) || (null === value)) {
            return false;
        }
        return value % 1 == 0;
    },
    //https://github.com/hapijs/hoek/blob/master/lib/index.js#L818
    isAbsolute: function isAbsolute(path, platform) {

        if (!path) {
            return false;
        }

        if (Path.isAbsolute) { // node >= 0.11
            return Path.isAbsolute(path);
        }

        platform = platform || process.platform;

        // Unix

        if (platform !== 'win32') {
            return path[0] === '/';
        }

        // Windows

        return !!/^(?:[a-zA-Z]:[\\\/])|(?:[\\\/]{2}[^\\\/]+[\\\/]+[^\\\/])/.test(path);
    }
}).create();

module.exports = utils;
