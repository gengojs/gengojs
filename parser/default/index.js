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
    utils = require('../../modules/utils'),
    filter = require('./filter'),
    regex = require('./regex'),
    vsprintf = require('sprintf-js').vsprintf,
    template = require('./template'),
    cldr = require('cldr');
/** 
 * @class Parser
 * @public
 * @description Parses the arguments.
 */
var Parser = Proto.extend({
    /**
     * @method init
     * @description Initializes the parser.
     * @param  {Gengo} context The context of Gengo.
     * @return {String}         The result.
     * @private
     */
    init: function(context) {
        //set context
        this.ctx = context;
        //filter the arguments and append to ctx
        _.forOwn(filter(context.phrase, context.other, context.length), function(item, key) {
            this.ctx[key] = item;
        }, this);
        //set the internal parser data to
        //an empty object
        this.data = {};
        //if context exists, parse and return the result
        if (context) return this.parse();
    },
    /**
     * @description Parses the arguments.
     * @return {String} The i18ned string.
     * @private
     */
    parse: function() {
        //filter the type of phrase.
        var result = filter().type(this.ctx.phrase);
        //get the key from the filter
        this.key = result.key;
        //read the data with the locale and set to data
        this.data = this.ctx.io.read(this.locale());
        //switch between types the parse according to type
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
        //apply sprintf and template to the result
        this.ctx.result = this.template(this.sprintf(this.ctx.result));
        //return the result
        return this.ctx.result;
    },
    /**
     * @description Parses phrases.
     * @return {String} The i18ned string.
     */
    _phrase: function() {
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
    },
    /**
     * @description Parses bracket with dot phrases.
     * @return {[type]} [description]
     */
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
                local = this.route() || this.data[key];
                //check if global data exists
                global = this.data ? (_.has(this.data, keywords.global) ? this.data[keywords.global] : null) : null;
                //if the bracket contains a dot notation
                if (dot) {
                    //match the dot.dot.dot
                    if (regex(dot).dot().match()) {
                        //deep search for the data and parse the result
                        result = this.parser(utils.find(local).dot(dot)) || this.parser(utils.find(global).dot(dot));
                        //check if key exists
                        result = _.has(result, key) ? result[key] : (result || null);
                    }
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
    count: function() {
        return cldr.extractPluralRuleFunction(this.locale().toLowerCase().replace('-', '_'))(this.ctx.values.count);
    },
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
            if (router.toArray().length() === 0) data = this.data[router.toDot()];
            else data = utils.find(this.data).dot(router.toDot()) || null;
        }
        return data || null;
    },
    locale: function() {
        var locale = this.ctx.values.locale,
            supported = this.ctx.settings.supported(),
            index = supported.indexOf(locale);
        return locale && supported[index] ? locale : this.ctx.accept.detectLocale();
    },
    sprintf: function(phrase) {
        if (this.hasPlurality()) this.ctx.args.push(this.ctx.values.count);
        return vsprintf(phrase, this.ctx.args);
    },
    template: function(phrase) {
        phrase = this.hasPlurality() ? template(phrase, {
            count: this.ctx.values.count
        }, this.ctx.settings.template()).parse() : phrase;
        return template(phrase, this.ctx.template, this.ctx.settings.template()).parse();
    }
});

module.exports = function() {
    //hack
    return function() {
        return Parser.create(this);
    };
};