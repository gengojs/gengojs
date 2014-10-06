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

(function () {
    'use strict';

    var markdown,
        regex = {
            bold: {
                "*": /\*{1}(.*?)\*{1}/g,
                "_": /\_{1}(.*?)\_{1}/g
            },
            italic: {
                "**": /\*{2}(.*?)\*{2}/g,
                "__": /\_{2}(.*?)\_{2}/g
            },
            superscript: {
                sup: /\^\[([^\s])\]/g,
                bookmark: /\^\[([^\s])\]\((#[^\s]+)\)/g,
                link: /\^\[\[([^\s])\]\]\((#[^\s]+)\)/g
            }
        },
        _ = require('underscore'),
        hasModule = (typeof module !== 'undefined' && module.exports);
    markdown = function (phrase) {
        return parse(phrase);
    };
    //http://pzxc.com/simple-javascript-markdown-parsing-function
    function parse(phrase) {
        //core may return undefined so make sure the input
        //is a string
        if (_.isString(phrase)) {
            var r = phrase;
            /*bold, italics, and code formatting*/

            //italics --> *hello* or _hello_
            //this will prevent regex from breaking
            if (r.match(regex.italic['**'])) {
                r = r.replace(regex.italic['**'], '<em>$1</em>');
            }
            if (r.match(regex.italic.__)) {
                r = r.replace(regex.italic.__, '<em>$1</em>');
            }
            //bold --> **hello** or __hello__
            if (r.match(regex.bold['*'])) {
                r = r.replace(regex.bold['*'], '<strong>$1</strong>');
            }
            if (r.match(regex.bold._)) {
                r = r.replace(regex.bold._, '<strong>$1</strong>');
            }
            //code --> `code`
            r = r.replace(/\`(.*?)\`/g, '<code>$1</code>');
            //strike --> ~~strike~~
            r = r.replace(/\~\~(.*?)\~\~/g, '<strike>$1</strike>');

            //superscript
            //normal --> ^[^\s]
            if (r.match(regex.superscript.sup)) {
                r = r.replace(regex.superscript.sup, '<sup>$1</sup>');
            }
            //bookmark --> ^[^\s](#bookmark)
            if (r.match(regex.superscript.bookmark)) {
                r = r.replace(regex.superscript.id, '<sup id="$2">$1</sup>');
            }
            //link --> ^[[^\s]](#bookmark)
            if (r.match(regex.superscript.link)) {
                r = r.replace(regex.superscript.id, '<a href="#$2"><sup>$1</sup></a>');
            }

            /*links*/
            //link --> [some text](http[s]?://...) or [some text](http[s]?://...)[target]
            r = r.replace(/\[([^\]]+)]\(\s*(http[s]?:\/\/[^)]+)\s*\)\[?(blank|self|parent|top|[a-z]+)?\]?/gm, '<a href="$2" target="$3">$1</a>');
            //twitter --> [some text](#attribute-to-text)
            r = r.replace(/\[([^\]]+)\]\((\#[^\s]+)\)/gm, '<a href="$2">$1</a>');
            //username --> [username](@username123) you can also add _blank etc
            r = r.replace(/\[([^\]]+)]\([\@]([^\s]+)\)\[?(blank|self|parent|top|[a-z]+)?\]?/gm, '<a href="https://twitter.com/$2" target="$3">$1</a>');

            // video ..will probably change to standard markdown syntax
            r = r.replace(/<<(.*?)>>/g, '<embed class="video" src="$1" allowfullscreen="true" allowscriptaccess="never" type="application/x-shockwave/flash"></embed>');
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
        define([], function () {
            return markdown;
        });
    }
}).call(this);
