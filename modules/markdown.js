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
        _ = require('underscore'),
        hasModule = (typeof module !== 'undefined' && module.exports);
    markdown = function(phrase) {
        return parse(phrase);
    };
    //http://pzxc.com/simple-javascript-markdown-parsing-function
    function parse(phrase) {
        //core may return undefined so make sure the input
        //is a string
        if (_.isString(phrase)) {
            var r = phrase,
                pre1 = [],
                pre2 = [];

            // store {{{ unformatted blocks }}} and <pre> pre-formatted blocks </pre>
            r = r.replace(/{{{([\s\S]*?)}}}/g, function(x) {
                pre1.push(x.substring(3, x.length - 3));
                return '{{{}}}';
            });
            r = r.replace(new RegExp('<pre>([\\s\\S]*?)</pre>', 'gi'), function(x) {
                pre2.push(x.substring(5, x.length - 6));
                return '<pre></pre>';
            });

            // bold, italics, and code formatting
            r = r.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>');
            r = r.replace(new RegExp('//(((?!https?://).)*?)//', 'g'), '<em>$1</em>');
            r = r.replace(/``(.*?)``/g, '<code>$1</code>');

            // links
            r = r.replace(/\[\[(http:[^\]|]*?)\]\]/g, '<a target="_blank" href="$1">$1</a>');
            r = r.replace(/\[\[(http:[^|]*?)\|(.*?)\]\]/g, '<a target="_blank" href="$1">$2</a>');
            r = r.replace(/\[\[([^\]|]*?)\]\]/g, '<a href="$1">$1</a>');
            r = r.replace(/\[\[([^|]*?)\|(.*?)\]\]/g, '<a href="$1">$2</a>');
            r = r.replace(/\[([^\]]+)]\(\s*(http[s]?:\/\/[^)]+)\s*\)\[?(blank|self|parent|top|[a-z]+)?\]?/gm, '<a href="$2" target="$3">$1</a>');

            // images
            r = r.replace(/{{([^\]|]*?)}}/g, '<img src="$1">');
            r = r.replace(/{{([^|]*?)\|(.*?)}}/g, '<img src="$1" alt="$2">');

            // video
            r = r.replace(/<<(.*?)>>/g, '<embed class="video" src="$1" allowfullscreen="true" allowscriptaccess="never" type="application/x-shockwave/flash"></embed>');


            // restore the preformatted and unformatted blocks
            r = r.replace(new RegExp('<pre></pre>', 'g'), function(match) {
                return '<pre>' + pre2.shift() + '</pre>';
            });
            r = r.replace(/{{{}}}/g, function(match) {
                return pre1.shift();
            });
            return r;
        }

    }


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
