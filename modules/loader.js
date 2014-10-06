/*jslint node: true, forin: true, jslint white: true, newcap: true*/
/*global console*/
/*
 * loader
 * author : Takeshi Iwana
 * https://github.com/iwatakeshi
 * license : MIT
 * Code heavily borrowed from Adam Draper
 * https://github.com/adamwdraper
 */

(function () {
    'use strict';

    var loader,
        utils = require('./utils.js'),
        isDefined = utils.isDefined,
        debug = utils.debug,
        _ = require('underscore'),
        config = require('./config.js'),
        //get an instance of fs for local file reading
        fs = require('fs'),
        localemap = require('../maps/locales.js'),
        locales = {},
        hasModule = (typeof module !== 'undefined' && module.exports);

    loader = function (locale) {
        return {
            json: function () {
                //store a temp dictionary
                var temp = getJSON(locale);
                //dictionary is cached
                if (locales[locale]) {
                    //compare with temp with existing dictionary
                    if (_.isEqual(temp, locales[locale])) {
                        //return it
                        return locales[locale];
                    } else {
                        //remove the dictionary for the requested locale
                        delete locales[locale];
                        //update it
                        locales[locale] = getJSON(locale);
                        //then return it
                        return locales[locale];
                    }
                } else {
                    //lets load it if cached doesn't exist.
                    locales[locale] = getJSON(locale);
                    return locales[locale];
                }
            }
        };
    };

    function getJSON(locale) {
        var json, ext;
        //if a '.' exists
        if (config().extension().indexOf('.') !== -1) {
            ext = config().extension().replace('.', '');
        } else {
            ext = config().extension().toLowerCase();
        }
        if (ext === 'js') {
            try {
                json = require(config().directory() + localemap.gengo[locale] + ".js");
                require.uncache(config().directory() + localemap.gengo[locale] + ".js");
                if (isDefined(json)) {
                    debug("module: loader fn: getJSON, " + localemap.gengo[locale] + ".js" + " loaded successfully.").info();
                    debug(JSON.stringify(json, null, 2)).data();
                    return sanitize(json);
                }
            } catch (error) {
                debug("module: loader fn: getJSON, " + error.toString().replace("Error: ", " ")).warn();
            }
        }

        if (ext === 'json') {
            var result = {};
            try {
                result = fs.readFileSync(config().directory() + localemap.gengo[locale] + ".json");
                try {
                    json = JSON.parse(result);
                    if (json) {
                        debug("module: loader fn: getJSON, " + localemap.gengo[locale] + ".json" + " loaded successfully.").info();
                        debug(JSON.stringify(json, null, 2)).data();
                        return sanitize(json);
                    }
                } catch (error) {
                    debug("module: loader fn: getJSON, " + error.toString().replace("Error: ", " ")).warn();
                }
            } catch (error) {
                debug("module: loader fn: getJSON, " + error.toString().replace("Error: ", " ")).warn();
            }

        }

    }

    //creates a copy of the object and joins any array
    //https://github.com/simov/deep-copy/blob/master/lib/dcopy.js#L22
    function sanitize(json) {
        var copy = (json instanceof Array) ? [] : {};
        (function read(json, copy) {
            for (var key in json) {
                var obj;
                //customized for gengojs
                if (_.isArray(json[key])) {
                    obj = json[key].join('\n');
                } else {
                    obj = json[key];
                }
                if (obj instanceof Object) {
                    var value = {},
                        last = add(copy, key, value);
                    read(obj, last);
                } else {
                    var _value = obj;
                    add(copy, key, _value);
                }
            }
        }(json, copy));

        function add(copy, key, value) {
            if (copy instanceof Object) {
                copy[key] = value;
                return copy[key];
            }
        }
        return copy;
    }

    //http://stackoverflow.com/a/14801711/1251031
    /**
     * Removes a module from the cache
     */
    require.uncache = function (moduleName) {
        // Run over the cache looking for the files
        // loaded by the specified module name
        require.searchCache(moduleName, function (mod) {
            delete require.cache[mod.id];
        });

        // Remove cached paths to the module.
        // Thanks to @bentael for pointing this out.
        Object.keys(module.constructor._pathCache).forEach(function (cacheKey) {
            if (cacheKey.indexOf(moduleName) > 0) {
                delete module.constructor._pathCache[cacheKey];
            }
        });
    };

    /**
     * Runs over the cache to search for all the cached
     * files
     */
    require.searchCache = function (moduleName, callback) {
        // Resolve the module identified by the specified name
        var mod = require.resolve(moduleName);

        // Check if the module has been resolved and found within
        // the cache
        if (mod && ((mod = require.cache[mod]) !== undefined)) {
            // Recursively go over the results
            (function run(mod) {
                // Go over each of the module's children and
                // run over it
                mod.children.forEach(function (child) {
                    run(child);
                });

                // Call the specified callback providing the
                // found module
                callback(mod);
            })(mod);
        }
    };
    /************************************
        Exposing loader
    ************************************/

    // CommonJS module is defined
    if (hasModule) {
        module.exports = loader;
    }

    /*global ender:false */
    if (typeof ender === 'undefined') {
        // here, `this` means `window` in the browser, or `global` on the server
        // add `loader` as a global object via a string identifier,
        // for Closure Compiler 'advanced' mode
        this.loader = loader;
    }

    /*global define:false */
    if (typeof define === 'function' && define.amd) {
        define([], function () {
            return loader;
        });
    }
}).call(this);
