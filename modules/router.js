/*jslint node: true, forin: true, jslint white: true, newcap: true*/
/*global console*/
/*
 * router
 * author : Takeshi Iwana
 * https://github.com/iwatakeshi
 * license : MIT
 * Code heavily borrowed from Adam Draper
 * https://github.com/adamwdraper
 */

(function () {
    'use strict';

    var router,
        path,
        pathArray,
        dotPath,
        subdomains,
        originalUrl,
        baseUrl,
        _ = require('lodash'),
        cout = require('cout'),
        hasModule = (typeof module !== 'undefined' && module.exports);

    router = function () {
        return {
            init: function (req) {
                try {
                    path = req.path;
                    //dont know if we ever need these but its there
                    baseUrl = req.baseUrl;
                    originalUrl = req.originalUrl;
                    subdomains = req.subdomains;
                    cout("module: router, fn: init.", {
                        path: path,
                        baseUrl: baseUrl,
                        originalUrl: originalUrl,
                        subdomains: subdomains
                    }).debug();
                } catch (error) {
                    cout("module: router, fn: init, Could not set the router.").error();
                }
            },
            route: function () {
                pathArray = constructArray(path);
                dotPath = constructDot(pathArray);
                cout("Router route path array", pathArray).debug();
                cout("Router route dot", dotPath).debug();
                return {
                    path: function () {
                        return path;
                    },
                    array: function () {
                        return pathArray;
                    },
                    dot: function () {
                        return dotPath;
                    },
                    length: function () {
                        if (dotPath.match(/\./g)) {
                            return dotPath.match(/\./g).length;
                        } else {
                            return 0;
                        }
                    }
                };
            }
        };
    };

    function constructDot(array) {
        var dotpathstr = "";
        if (array.length > 1) {
            dotpathstr = array.join().replace(/,/g, ".");
            return dotpathstr;
        } else {
            return array[0];
        }
    }

    function constructArray(path) {
        var pathArray = path.split('/'),
            filteredPathArray = [],
            newpath = [];
        var regexVersion = /\d{1,2}(\.)\d{1,2}((\.)\d{1,2})?$/;

        if (pathArray.length < 3) {
            //its safe to say that pathArray[0] will always be ''
            if (pathArray[1] === '') {
                newpath.push('index');
            } else {
                //maybe something does exist besides ''
                newpath.push(pathArray[1]);
            }
        } else {
            _.forEach(pathArray, function (item) {
                if (item.match(regexVersion)) {
                    filteredPathArray.push(item.replace('.', '*'));
                } else {
                    filteredPathArray.push(item);
                }
            });

            pathArray = filteredPathArray;
            for (var count = 1; count < pathArray.length; count++) {
                if (count === 1) {
                    if (pathArray[count] === '') {
                        newpath.push('index');
                    } else {
                        newpath.push(pathArray[count]);
                    }
                } else {
                    //make sure nothing else is empty
                    if (pathArray[count] !== '') {
                        newpath.push(pathArray[count]);
                    }
                }
            }
        }
        return newpath;
    }
    /************************************
        Exposing router
    ************************************/

    // CommonJS module is defined
    if (hasModule) {
        module.exports = router;
    }

    /*global ender:false */
    if (typeof ender === 'undefined') {
        // here, `this` means `window` in the browser, or `global` on the server
        // add `router` as a global object via a string identifier,
        // for Closure Compiler 'advanced' mode
        this.router = router;
    }

    /*global define:false */
    if (typeof define === 'function' && define.amd) {
        define([], function () {
            return router;
        });
    }
}).call(this);
