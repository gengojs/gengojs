/*jslint node: true, forin: true, jslint white: true, newcap: true*/
/*global console*/
/*
 * markdown
 * author : Takeshi Iwana
 * https://github.com/iwatakeshi
 * license : MIT
 * Code heavily borrowed from Adam Draper
 * https://github.com/adamwdraper
 */

(function() {
    'use strict';

    var markdown,
        hasModule = (typeof module !== 'undefined' && module.exports),
        regex = {
            links: new RegExp(/\[([^\]]+)]\(\s*(http[s]?:\/\/[^)]+)\s*\)\[?(blank|self|parent|top|[a-z]+)?\]?/)
        };

    markdown = function(phrase) {
        if (regex.links.test(phrase)) {
            var links = regex.links.exec(phrase),
                text = links[1],
                url = links[2],
                target = links[3];
            if (target) {
                target = "_" + target;
            } else {
                target = "_self";
            }
            return " <a href=\"" + url + " \" target=\"" + target + "\">" + text + "</a> ";
        } else {
            return phrase;
        }
    };


    /************************************
        Exposing markdown
    ************************************/

    // CommonJS module is defined
    if (hasModule) {
        module.exports = markdown;
    }

    /*global ender:false */
    if (typeof ender === 'undefined') {
        // here, `this` means `window` in the browser, or `global` on the server
        // add `markdown` as a global object via a string identifier,
        // for Closure Compiler 'advanced' mode
        this.markdown = markdown;
    }

    /*global define:false */
    if (typeof define === 'function' && define.amd) {
        define([], function() {
            return markdown;
        });
    }
}).call(this);
