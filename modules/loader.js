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
    regex = utils.regex,
    isDefined = utils.isDefined,
    debug = utils.debug,
    _ = require('underscore'),
    config = require('./config.js'),
    //get an instance of fs for local file reading
    fs = require('fs'),
    localemap = require('../maps/locales.js'),
    locales = {},
    hasModule = (typeof module !== 'undefined' && module.exports);

  loader = function(locale) {
    return {
      json: function() {
        var temp = getJSON(locale);
        if (locales[locale]) {
          if (equal(temp, locales[locale])) {
            return locales[locale];
          } else {
            delete locales[locale];
            locales[locale] = getJSON(locale);
            return locales[locale];
          }
        } else {
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
  //http://stackoverflow.com/a/1144249
  function equal(obj1, obj2) {
    function objectEquals(x, y) {
      // if both are function
      if (x instanceof Function) {
        if (y instanceof Function) {
          return x.toString() === y.toString();
        }
        return false;
      }
      if (x === null || x === undefined || y === null || y === undefined) {
        return x === y;
      }
      if (x === y || x.valueOf() === y.valueOf()) {
        return true;
      }

      // if one of them is date, they must had equal valueOf
      if (x instanceof Date) {
        return false;
      }
      if (y instanceof Date) {
        return false;
      }

      // if they are not function or strictly equal, they both need to be Objects
      if (!(x instanceof Object)) {
        return false;
      }
      if (!(y instanceof Object)) {
        return false;
      }

      var p = Object.keys(x);
      return Object.keys(y).every(function(i) {
          return p.indexOf(i) !== -1;
        }) ?
        p.every(function(i) {
          return objectEquals(x[i], y[i]);
        }) : false;
    }
    return objectEquals(obj1, obj2);
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
