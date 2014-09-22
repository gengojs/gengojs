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

(function() {
    'use strict';

    var loader,
        utils = require('./utils.js'),
        debug = utils.debug,
        config = require('./config.js'),
        //get an instance of fs for local file reading
        fs = require('fs'),
        //get an instance of xml2js for xml parsing
        xml2js = require('xml2js'),
        hasModule = (typeof module !== 'undefined' && module.exports);

    loader = function(locale) {
        return {
            json: function() {
                return getJSON(locale);
            }
        };
    };

    function getXML(locale) {
        var parser = new xml2js.Parser();
        try {
            //parse the xml
            parser.parseString(fs.readFileSync(config().directory() + locale + ".xml"), function(error, result) {
                debug("module: loader fn: getXML, XML loaded successfully.").info();
                //set the xml locale
                debug(result).data();
                return result;
            });
        } catch (error) {
            debug("module: loader fn: getXML, Could not load XML or it does not exist.").warn();
        }
    }

    function getJSON(locale) {
        try {
            var json = require(config().directory() + locale + ".js");
            if (utils.isDefined(json)) {
                debug("module: loader fn: getJSON, " + locale + ".js" + " loaded successfully.").info();
                debug(JSON.stringify(json, null, 2)).data();
                return json;
            }
        } catch (error) {
            debug("module: loader fn: getJSON, " + error.toString().replace("Error: ", " ")).warn();
        }
    }

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
        define([], function() {
            return loader;
        });
    }
}).call(this);
