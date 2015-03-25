/*jslint node: true, forin: true, jslint white: true, newcap: true, curly:false*/
/*
 * gengojs-core
 * author : Takeshi Iwana
 * https://github.com/iwatakeshi
 * license : MIT
 */
(function() {
  'use strict';
  /* Imports */
  var root = require('app-root-path'),
    version = require(root + '/package').version,
    path = require('path'),
    extract = require(root + '/modules/extract/'),
    plugify = require(root + '/lib/plugify/'),
    _ = require('lodash'),
    Proto = require('uberproto');
  /**
   * @class
   * @description gengo.js Constructor.
   * @private
   */
  var Gengo = Proto.extend({
    init: function(options, plugins) {
      //version
      this.version = version;
      // top level gengo (applied api)
      this.gengo = undefined;
      // (String | Object) internal options
      this.options = options || path.normalize(root + '/settings/');
      //current server
      this.server = '';
      // i18ned string
      this.result = '';

      /* Plugins */

      this.plugins = {};
      // low level api
      this.plugins.parsers = [];
      this.plugins.configs = [];
      this.plugins.routers = [];
      this.plugins.backends = [];
      this.plugins.apis = [];
      this.plugins.accepts = [];
      this.plugins.localizes = [];
      this.plugins.applys = [];
      // set plugins
      this.use(plugins);
      // configs
      _.forEach(this.plugins.configs, function(plugin) {
        // expose the current plugin to the context
        this.plugins._config = plugin.package;
        plugin.apply(this);
      }, this);
      // backends (MUST initialize this before parsing!)
      _.forEach(this.plugins.backends, function(plugin) {
        this.plugins._backend = plugin.package;
        plugin.apply(this);
      }, this);
    },
    /**
     * @method parse
     * @description Calls all parsers for i18n.
     * @param  {(String | Object)} phrase The phrase or object (ex {phrase:'',locale:'en'}) to parse.
     * @param  {Object} other  The arguments and values extracted when 'arguments' > 1.
     * @param  {Number} length The number of 'arguments'.
     * @return {String}        The i18ned string.
     * @private
     */
    parse: function(phrase) {
      this.length = arguments.length;
      this.phrase = phrase;
      this.other = extract(arguments, this.length);
      this.arguments = arguments;
      _.forEach(this.plugins.parsers, function(plugin) {
        this.plugins._parser = plugin.package;
          plugin.apply(this);
      }, this);
      return this.result;
    },
    /** Ship is the middleware for Express, Koa, and Hapi */
    ship: function() {
      // get the request, response
      var req = arguments[0],
        res = arguments[1] || null,
        next = arguments[2] || null;

      /*Set plugins */
      // accepts
      _.forEach(this.plugins.accepts, function(plugin) {
        this.plugins._accept = plugin.package;
        plugin.bind(this)(req, res);
      }, this);
      // routers
      _.forEach(this.plugins.routers, function(plugin) {
        this.plugins._router = plugin.package;
        plugin.bind(this)(req, res);
      }, this);
      // localize(s)
      _.forEach(this.plugins.localizes, function(plugin) {
        this.plugins._localize = plugin.package;
        plugin.apply(this);
      }, this);
      /* Apply API */

      // koa?
      if (this.isKoa(req)) {
        this.server = 'koa';
        //apply api to koa
        this.apply(req.request, req.response);
        if (req.req || req.res) this.apply(req.req, req.res);
        if (req.state) this.apply(req.state);
      }
      // hapi?
      if (this.isHapi(req)) {
        this.server = 'hapi';
        if (req.response)
          if (req.response.variety === 'view') this.apply(req.response.source.context);
        this.apply(req);
      }
      // express ?
      if (this.isExpress(req)) {
        this.server = 'express';
        this.apply(req, res);
        // apply to API to the view
        if (res && res.locals) this.apply(res.locals);
      }
      if (_.isFunction(next)) next();
    },
    /**
     * @method use
     * @description Enables Gengo to accept a plugins.
     * @param  {Function} fn The plugins parser for Gengo to use.
     * @private
     */
    use: function(plugins) {
      if (plugins) plugins = _.isArray(plugins) ? plugins : [plugins()] || null;
      // set defaults and plugins
      _.forEach(plugify(plugins), function(plugin) {
        // example: this.plugins.parser.default
        this.plugins[plugin.package.type] = {};
        this.plugins[plugin.package.type][plugin.package.name] = plugin;
        this.plugins[plugin.package.type][plugin.package.name].package = plugin.package;
        // insert plugins as callbacks
        this.plugins[plugin.package.type + 's'].push(plugin);
      }, this);
    },
    /** 
     * @method _apply
     * @description Applies the API to an object.
     * @private
     */
    apply: function() {
      // apply
      _.forEach(this.plugins.applys, function(plugin) {
        this.plugins._apply = plugin.package;
        plugin.bind(this)();
      }, this);
      return this.gengo;
    },
    /** 
     * @method _api
     * @description Sets the API.
     * @return {Object} The api for Gengo.
     * @private
     */
    _api: function() {
      // api
      _.forEach(this.plugins.apis, function(plugin) {
        this.plugins._api = plugin.package;
        plugin.bind(this)();
      }, this);
      return this.api;
    },
    isKoa: function(req) {
      return req && !req.raw ? (req.response && req.request) : !_.isEmpty(this.server) ? this.server === 'koa' : false;
    },
    isHapi: function(req) {
      return req ? (req.raw) : !_.isEmpty(this.server) ? this.server === 'hapi' : false;
    },
    isExpress: function(req) {
      return req && req.raw ? (req && !req.raw && !req.response) : !_.isEmpty(this.server) ? this.server === 'express' : false;
    }
  });

  module.exports = Gengo;
}).call(this);