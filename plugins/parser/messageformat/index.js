/*jslint node: true, forin: true, jslint white: true, newcap: true, curly: false*/
var Proto = require('uberproto');
var _ = require('lodash');
var mf = require('messageformat');
var utils = require('../../modules/utils');
var filter = require('./filter');
var regex = require('./regex');

var MessageFormat = Proto.extend({
  init: function(context) {
    this.phrase = '';
    this.values = {};
    this.message = {};
    this.ctx = this.filter(context);
    if (context && !_.isEmpty(context.phrase)) return this.parse();
  },
  filter: function(context) {
    var phrase = context.phrase,
      other = context.other;
    //maybe phrase is an plain object
    if (_.isPlainObject(phrase) || _.isObject(phrase)) {
      _.forOwn(phrase, function(item, key) {
        switch (key) {
          case 'phrase':
            this.phrase = phrase[key];
            delete phrase[key];
            break;
          case 'locale':
            if (!this.values[key]) this.values[key] = item;
            break;
          default:
            if (!this.message[key]) this.message[key] = item;
            break;
        }
      }, this);
    } else if (_.isString(phrase)) this.phrase = phrase;

    if (other) {
      //check that values only contains keywords
      if (!_.isEmpty(other.values()))
        _.forOwn(other.values(), function(item, key) {
          switch (key) {
            case 'locale':
              if (!this.values[key]) this.values[key] = item;
              break;
            default:
              if (!this.message[key]) this.message[key] = item;
              break;
          }
        }, this);
      //check that args only contains strings or numbers
      if (!_.isEmpty(other.args()))
        _.forEach(other.args(), function(item) {
          _.forOwn(item, function(item, key) {
            switch (key) {
              case 'locale':
                if (!this.values[key]) this.values[key] = item;
                break;
              default:
                if (!this.message[key]) this.message[key] = item;
                break;
            }
          }, this);

        }, this);
    }
    return context;
  },
  locale: function() {
    var locale = this.values.locale,
      supported = this.ctx.settings.supported(),
      index = supported.indexOf(locale);
    return locale && supported[index] ? locale : this.ctx.accept.detectLocale();
  },
  parse: function() {
    this.data = this.ctx.io.read(this.locale());
    this.format = new mf(this.locale());
    var result = filter().type(this.ctx.phrase);
    this.key = result.key;
    switch (result.type) {
      case 'phrase':
        this.ctx.result = this._phrase();
        break;
      case 'bracket':
        this.ctx.result = this._bracket();
        break;
      case 'dot':
        this.ctx.result = this._dot();
        break;
    }
    this.ctx.result = this.format.compile(this.ctx.result)(this.message);
    return this.ctx.result;
  },
  _phrase: function() {
    var settings = this.ctx.settings,
      keywords = settings.keywords(),
      result, data, global;
    try {
      data = this.data || this.route();
      global = this.route() ? (_.has(this.route(), keywords.global) ? this.route()[keywords.global] : null) : null;
      if (!_.isEmpty(this.data)) {
        result = (_.has(data, this.key)) ? (data[this.key] || null) : (_.has(global, this.key)) ? global[this.key] : null;
        result = this.parser(result);
      }
    } catch (err) {
      console.warn(err.stack || String(err));
    }
    return result || null;
  },
  _bracket: function() {
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
  },
  _dot: function() {
    var settings = this.ctx.settings,
      keywords = settings.keywords(),
      search = this.key,
      result, data, global;
    try {
      if (!_.isEmpty(this.data)) {
        data = this.data || this.route();
        global = this.route() ? (_.has(this.route(), keywords.global) ? this.route()[keywords.global] : null) : null;
        result = this.parser(this.parser(utils.find(data).dot(search)) || this.parser(utils.find(global).dot(search)));
      }
    } catch (err) {
      console.warn(err.stack || String(err));
    }
    return result || null;
  },
  parser: function(obj) {
    if (obj) {
      var settings = this.ctx.settings,
        keywords = settings.keywords(),
        key = (this.locale() === settings.default()) ? keywords.default : keywords.translated;
      if (_.isString(obj)) return obj;
      if (_.isPlainObject(obj)) {
        if (_.has(obj, key)) {
          if (this.hasPlurality()) {
            if (_.has(obj, keywords.plural))
              if (_.has(obj[keywords.plural], this.count()))
                return _.has(obj[keywords.plural][this.count()], key) ? obj[keywords.plural][this.count()][key] : null;
          } else return _.has(obj, key) ? obj[key] : obj;
        } else return this.hasPlurality() ? (obj[keywords.plural] || obj[this.count()] || null) : null;
      }
    }
  },
  route: function() {
    var settings = this.ctx.settings,
      router = this.ctx.router,
      data;
    if (settings.isRouter()) {
      if (router.toArray().length === 0) data = this.data[router.toDot()];
      else data = utils.find(this.data).dot(router.toDot());
      return data;
    }
    return data || null;
  }

});

module.exports = function() {
  return function() {
    return MessageFormat.create(this);
  };
};
