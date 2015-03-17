/*jslint node: true, forin: true, jslint white: true, newcap: true, curly: false*/
var Proto = require('uberproto'),
    _ = require('lodash'),
    utils = require('../../modules/utils'),
    filter = require('./filter'),
    regex = require('./regex'),
    vsprintf = require('sprintf-js').vsprintf,
    template = require('./template'),
    cldr = require('cldr');

var Parser = Proto.extend({
    init: function(context) {
        //set context
        this.ctx = context;
        _.forOwn(filter(context.phrase, context.other, context.length), function(item, key) {
            this.ctx[key] = item;
        }, this);
        this.data = {};
        if (context) return this.parse();
    },
    parse: function() {
        var result = filter().type(this.ctx.phrase);
        this.key = result.key;
        this.data = this.ctx.io.read(this.locale());
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
        this.ctx.result = this.template(this.sprintf(this.ctx.result));
        return this.ctx.result;
    },
    _phrase: function() {
        var settings = this.ctx.settings,
            keywords = settings.keywords(),
            result, data, global;
        try {
            data = this.route() || this.data;
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
            search = this.key[1] ? this.key[1] : null,
            dot = this.key[2] ? this.key[2] : null,
            result, data, global;
        try {
            if (!_.isEmpty(this.data)) {
                data = this.route() || this.data[search] ;
                global = this.route() ? (_.has(this.route(), keywords.global) ? this.route()[keywords.global] : null) : null;
                if (dot) {
                    if (regex(dot).dot().match()) {
                        //then the dot is 'dot.dot.dot'
                        result = this.parser(utils.find(data).dot(dot)) || this.parser(utils.find(global).dot(dot));
                        result = _.has(result, search) ? result[search] : (result || null);
                    }
                } else {
                    var scope;
                    if (data) scope = (_.has(data, search)) ? data[search] : data;
                    else if (global) scope = (_.has(global, search)) ? global[search] : global;
                    result = result || this.parser(scope);
                    result = result ? (_.has(result, search) ? result[search] : (result || null)) : null;
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
                data = this.route() || this.data;
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
    count: function() {
        return cldr.extractPluralRuleFunction(this.locale())(this.ctx.values.count);
    },
    hasPlurality: function() {
        return !isNaN(this.ctx.values.count);
    },
    route: function() {
        var settings = this.ctx.settings,
            router = this.ctx.router,
            data;
        if (settings.isRouter()) {
            if (router.toArray().length() === 0) data = this.data[router.toDot()];
            else data = utils.find(this.data).dot(router.toDot()) || null;
            return data;
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
