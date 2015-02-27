/*jslint node: true, forin: true, jslint white: true, newcap: true, curly:false*/

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
var S = require('string');
var root = require('app-root-path');

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
        str = str.toLowerCase();
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
        return value % 1 === 0;
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
    },
    isPartOfDirectory: function(path) {
        if (S(path).include(root)) return true;
        else return false;
    },
    require: {
        //http://stackoverflow.com/a/14801711/1251031
        /**
         * Removes a module from the cache
         */
        uncache: function(moduleName) {
            // Run over the cache looking for the files
            // loaded by the specified module name
            this.require.findCache(moduleName, function(mod) {
                delete require.cache[mod.id];
            });

            // Remove cached paths to the module.
            // Thanks to @bentael for pointing this out.
            Object.keys(module.constructor._pathCache).forEach(function(cacheKey) {
                if (cacheKey.indexOf(moduleName) > 0) {
                    delete module.constructor._pathCache[cacheKey];
                }
            });
        },
        /**
         * Runs over the cache to search for all the cached
         * files
         */
        findCache: function(moduleName, callback) {
            // Resolve the module identified by the specified name
            var mod = require.resolve(moduleName);

            // Check if the module has been resolved and found within
            // the cache
            if (mod && ((mod = require.cache[mod]) !== undefined)) {
                // Recursively go over the results
                (function run(mod) {
                    // Go over each of the module's children and
                    // run over it
                    mod.children.forEach(function(child) {
                        run(child);
                    });

                    // Call the specified callback providing the
                    // found module
                    callback(mod);
                })(mod);
            }
        }
    }
}).create();


module.exports = utils;
