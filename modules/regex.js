/*jslint node: true, forin: true, jslint white: true, newcap: true*/
/*global console*/
/*
 * regex.js
 * version : 0.0.0
 * author : Takeshi Iwana
 * license : MIT
 * Code heavily borrowed from Adam Draper
 */

(function() {
    'use strict';

    /************************************
        Helpers
    ************************************/


    /************************************
        Constants & Variables
    ************************************/

    var regex,
        // check for nodeJS
        hasModule = (typeof module !== 'undefined' && module.exports),
        patterns = {
            bracket: {
                dot: new RegExp(/^\[([a-z\.]+)\]\.([a-z\.]+)/),
                phrase: new RegExp(/^\[([\s\S]+)\]\.([a-z\.]+)/),
                phrase2: new RegExp(/^\[(.*)\]/),
                brackdot: new RegExp(/^\[([a-z\.]+)\]\.([a-z\.]+)/),
                brackdot2: new RegExp(/^\[([a-z\.]+)\]/)
            },
            mustache: new RegExp(/{{.*}}/),
            sprintf: new RegExp(/%/),
            locale: new RegExp(/^[a-z]{2}(?:-([a-z]{2,4}))?/)
        };

    /************************************
        Top Level Functions
    ************************************/

    regex = function(str) {
        var Dot = function() {
            var _isDot = false;
            //http://stackoverflow.com/a/25799425/1251031
            if (str.match(/\.[^.]/) && !str.match(/\s/)) {
                _isDot = true;
            }

            return {
                exec: function() {
                    if (_isDot) {
                        return str;
                    }
                },
                match: function() {
                    return _isDot;
                }
            };
        };

        var Bracket = function() {
            var _isDot = false,
                _isPhrase = false,
                _isBrackdot = false;

            if (patterns.bracket.dot.test(str)) {
                _isDot = true;
            }

            if (patterns.bracket.phrase.test(str) || patterns.bracket.phrase2.test(str)) {
                _isPhrase = true;
            }
            if (patterns.bracket.brackdot.test(str) || patterns.bracket.brackdot2.test(str)) {
                _isBrackdot = true;
            }

            return {
                exec: function() {
                    if (_isDot) {

                        return patterns.bracket.dot.exec(str);
                    } else if (_isPhrase) {

                        return patterns.bracket.phrase.exec(str) || patterns.bracket.phrase2.exec(str);
                    } else if (_isBrackdot) {
                        return patterns.bracket.brackdot.exec(str) || patterns.bracket.brackdot2.exec(str);
                    }
                },
                match: function() {
                    return _isDot || _isPhrase || _isBrackdot;
                }
            };

        };

        var Mustache = function() {
            var _isMustache = false;
            if (patterns.mustache.test(str)) {
                _isMustache = true;
            }
            return {
                match: function() {
                    return _isMustache;
                }
            };
        };

        var Sprintf = function() {
            var _isSprintf = false;
            if (patterns.sprintf.test(str)) {
                _isSprintf = true;
            }
            return {
                match: function() {
                    return _isSprintf;
                }
            };
        };

        var Locale = function() {
            var _isLocale = false;
            if (patterns.locale.test(str)) {
                _isLocale = true;
            }
            return {
                match: function() {
                    return _isLocale;
                },
                exec: function() {
                    if (_isLocale) {
                        return patterns.locale.exec(str);
                    }
                },
                toUpperCase: function() {
                    var templocale = "";
                    var _result = patterns.locale.exec(str);
                    if (_result[1]) {
                        templocale = str.replace(_result[1], _result[1].toUpperCase());
                        return templocale;
                    } else {
                        return str;
                    }
                }
            };

        };
        return {
            Dot: Dot,
            Bracket: Bracket,
            Mustache: Mustache,
            Sprintf: Sprintf,
            Locale: Locale
        };

    };

    /************************************
        Exposing regex
    ************************************/

    // CommonJS module is defined
    if (hasModule) {
        module.exports = regex;
    }

    /*global ender:false */
    if (typeof ender === 'undefined') {
        // here, `this` means `window` in the browser, or `global` on the server
        // add `regex` as a global object via a string identifier,
        // for Closure Compiler 'advanced' mode
        this.regex = regex;
    }

    /*global define:false */
    if (typeof define === 'function' && define.amd) {
        define([], function() {
            return regex;
        });
    }
}).call(this);