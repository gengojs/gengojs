/*jslint node: true, forin: true, jslint white: true, newcap: true, curly: false*/
/**
 * Takeshi Iwana aka iwatakeshi
 * MIT 2015
 * index.js
 * This module is the default parser
 * for Gengo
 */
var Proto = require('uberproto'),
  _ = require('lodash'),
  utils = require('./utils/'),
  filter = require('./filter/'),
  regex = require('./regex/'),
  vsprintf = require('sprintf-js').vsprintf,
  template = require('./template/'),
  cldr = require('cldr');
/** 
 * @class Parser
 * @public
 * @description Parses the arguments.
 */
var Parser = Proto.extend({
  init: function(context) {
    //set context
    this.ctx = context;
    //filter the arguments and append to ctx
    _.forOwn(filter(context.phrase, context.other, context.length), function(item, key) {
      this.ctx[key] = item;
    }, this);
    this.data = this.ctx.backend.read(this.locale());
    // console.log('PARSER DATA', this.data);
    //if context exists, parse and return the result
    return this;
  },
  /**
   * @description Parses the arguments.
   * @return {String} The i18ned string.
   * @private
   */
  parse: function() {
    // console.log('IN PARSER BEGIN');
    //filter the type of phrase.
    var result = filter().type(this.ctx.phrase);
    //get the key from the filter
    this.key = result.key;
    //switch between types the parse according to type
    switch (result.type) {
      case 'phrase':
        this.ctx.result = new Type().phrase.apply(this);
        break;
      case 'bracket':
        this.ctx.result = new Type().bracket.apply(this);
        break;
      case 'dot':
        this.ctx.result = new Type().dot.apply(this);
        break;
    }
    //apply sprintf and template to the result
    this.ctx.result = this.template(this.sprintf(this.ctx.result));
    //remove any caches
    if(!this.ctx.backend.cache) delete this.data;
    //return the result
    if (!this.ctx.values.parser || this.ctx.values.parser === 'default') return this.ctx.result;
    else return "";
  },
  /**
   * @description Parses the object and handles plurality
   * @param  {(Object | String)} obj The object to parse
   * @return {(String | null)}     The i18ned string.
   */
  parser: function(obj) {
    if (!obj) return "";
    var settings = this.ctx.settings,
      keywords = settings.keywords(),
      key = (this.locale() === settings.default()) ? keywords.default : keywords.translated;
    //if the object is already a string then return
    if (_.isString(obj)) return obj;
    //if its a {}
    if (_.isPlainObject(obj)) {
      //check if already contains the key 'default' or 'translated'
      if (_.has(obj, key)) {
        //check if this is plural
        if (this.hasPlurality()) {
          //check if the plural key is specified.
          if (_.has(obj, keywords.plural)) {
            //check if the plural count (one, other, etc) is specified
            if (_.has(obj[keywords.plural], this.count()))
            //then return it
              return _.has(obj[keywords.plural][this.count()], key) ? obj[keywords.plural][this.count()][key] : null;
            //else we will check if its the count is specified
          } else if (_.has(obj, this.count())) return obj[this.count()];
          //since its not plural check if the object has a key
        } else return _.has(obj, key) ? obj[key] : obj;
        //since it does not have the key lets just check for plularity
      } else return this.hasPlurality() ? (obj[keywords.plural] || obj[this.count()] || null) : null;
    }
  },
  /** Extracts the count key for the requested locale */
  count: function() {
    return cldr.extractPluralRuleFunction(this.locale().toLowerCase().replace('-', '_'))(this.ctx.values.count);
  },
  /** Returns the validity whether plurality was specified */
  hasPlurality: function() {
    return !isNaN(this.ctx.values.count);
  },
  /**
   * @description Routes the data according to the path.
   * @return {Object} The routed data.
   */
  route: function() {
    var settings = this.ctx.settings,
      router = this.ctx.router,
      data;
    //check if router is enabled
    if (settings.isRouter()) {
      //if dot depth is 0 else deep search for the data
      if (router.toArray().length === 0) data = this.data[router.toDot()];
      else data = utils.find(this.data).dot(router.toDot()) || null;

    }
    return data || null;
  },
  /**
   * @description Returns the requested locale if supported
   * @return {String} The locale
   */
  locale: function() {
    var locale = this.ctx.values.locale,
      supported = this.ctx.settings.supported(),
      index = supported.indexOf(locale);
    return locale && supported[index] ? locale : this.ctx.accept.getLocale();
  },
  /**
   * @description Applies basic vsprintf
   * @param  {String} phrase The phrase to apply vsprintf
   * @return {String}        The applied string.
   */
  sprintf: function(phrase) {
    return vsprintf(phrase, this.ctx.args);
  },
  /**
   * @description Applies interpolation
   * @param  {String} phrase The phrase to apply interpolation
   * @return {String}        The applied string.
   */
  template: function(phrase) {
    if (this.hasPlurality()) this.ctx.template.count = this.ctx.values.count;
    return template(phrase, this.ctx.template, this.ctx.settings.template()).parse();
  }
});

/**
 * @class Type
 */
function Type() {
  this.phrase = function() {
    var settings = this.ctx.settings,
      keywords = settings.keywords(),
      result, local, global;
    //try to get data
    try {
      //check if router is enabled and data exists under router
      local = this.route() || this.data;
      //check if global data exists
      global = this.data ? (_.has(this.data, keywords.global) ? this.data[keywords.global] : null) : null;
      //make sure that data exists
      if (!_.isEmpty(this.data)) {
        //check if the key exists under the local or global scope and parse the result
        result = this.parser((_.has(local, this.key)) ? (local[this.key] || null) : (_.has(global, this.key)) ? global[this.key] : null);
      }
    } catch (err) {
      console.warn(err.stack || String(err));
    }
    return result || null;
  };
  this.bracket = function() {
    var settings = this.ctx.settings,
      keywords = settings.keywords(),
      key = this.key[1] ? this.key[1] : null,
      dot = this.key[2] ? this.key[2] : null,
      result, local, global;
    try {
      //make sure data exists
      if (!_.isEmpty(this.data)) {
        //check if router is enabled and data exists under router
        local = this.route() || this.data;
        //check if local data exists or even has the value from the key
        local = (_.has(local, key)) ? (local[key] || local) : local;
        //check if global data exists
        global = this.data ? (_.has(this.data, keywords.global) ? this.data[keywords.global] : null) : null;
        global = (_.has(global, key)) ? (global[key] || global) : global;
        //if the bracket contains a dot notation
        if (dot) {
          //match the dot.dot.dot
          if (regex(dot).dot().match()) {
            //deep search for the data and parse the result
            result = this.parser(utils.find(local).dot(dot)) || this.parser(utils.find(global).dot(dot));
            //check if key exists
            result = _.has(result, key) ? result[key] : (result || null);
          } else result = this.parser(local ? local[dot] : local || global ? global[dot] : global);
        } else {
          var scope;
          //since it contains only a single dot
          //check if the local or global scope contains the key
          if (local) scope = (_.has(local, key)) ? local[key] : local;
          else if (global) scope = (_.has(global, key)) ? global[key] : global;
          //parse the scope 
          result = this.parser(scope);
          //check if key exists
          result = result ? (_.has(result, key) ? result[key] : (result || null)) : null;
        }
      }
    } catch (err) {
      console.warn(err.stack || String(err));
    }
    return result || null;
  };
  this.dot = function() {
    var settings = this.ctx.settings,
      keywords = settings.keywords(),
      search = this.key,
      result, local, global;
    try {
      if (!_.isEmpty(this.data)) {
        local = this.route() || this.data;
        global = this.route() ? (_.has(this.route(), keywords.global) ? this.route()[keywords.global] : null) : null;
        result = this.parser(this.parser(utils.find(local).dot(search)) || this.parser(utils.find(global).dot(search)));
      }
    } catch (err) {
      console.warn(err.stack || String(err));
    }
    return result || null;
  };
}


function ship() {
  this.result = Parser.create(this).parse();
  return this.result;
};

module.exports = function() {
  var register = ship;
  register.package = require('./package');
  register.package.isAsync = true;
  return register;
}