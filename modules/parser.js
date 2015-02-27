var Proto = require('uberproto');
var _ = require('lodash');
var S = require('string');
var vsprintf = require('sprintf-js').vsprintf;
var utils = require('./utils');

var parser = Proto.extend({
    init: function(context) {
        this.patterns = {
            dot: new RegExp(/^\[([a-z\.]+)\]\.([a-z\.]+)/),
            phrase: new RegExp(/^\[([\s\S]+)\]\.([a-z\.]+)/),
            phrase2: new RegExp(/^\[(.*)\]/),
            brackdot: new RegExp(/^\[([a-z\.]+)\]\.([a-z\.]+)/),
            brackdot2: new RegExp(/^\[([a-z\.]+)\]/)
        };
        if (context) return this.parse(context);
    },
    parse: function(context) {
        this._this = context;

        this.phrase = this._this.phrase;
        var result = this.filter(this.phrase)
        this.key = result.key;
        this.data = this._this.store.set(this._this.io).save()[this.locale()];
        switch (result.type) {
            case 'phrase':
                this._this.result = this._phrase();
                break;
            case 'bracket':
                this._this.result = this._bracket();
                break;
            case 'dot':
                this._this.result = this._dot();
                break;
        }
        this._this.result = this.template(this.sprintf(this._this.result));
        return this._this.result;
    },
    _phrase: function() {
        var settings = this._this.settings,
            keywords = settings.keywords(),
            result, data, global;
        try {
            data = this.data || this.dive();
            global = this.dive() ? (_.has(this.dive(), keywords.global) ? this.dive()[keywords.global] : null) : null;
            if (!_.isEmpty(this.data)) {
                result = (_.has(data, this.key)) ? (data[this.key] || null) : (_.has(global, this.key)) ? global[this.key] : null;
                result = this._parser(result);

            }
        } catch (err) {
            console.warn(err.stack || String(err));
        }
        return result || null;
    },
    _bracket: function() {
        var settings = this._this.settings,
            keywords = settings.keywords(),
            search = this.key[1] ? this.key[1] : null,
            dot = this.key[2] ? this.key[2] : null,
            result,
            data,
            global;

        try {
            if (!_.isEmpty(this.data)) {
                data = this.data[search] || this.dive();
                global = this.dive() ? (_.has(this.dive(), keywords.global) ? this.dive()[keywords.global] : null) : null;
                if (dot) {
                    if (this.regex(dot).dot().match()) {
                        //then the dot is 'dot.dot.dot'
                        result = this._parser(utils.find(data).dot(dot)) || this._parser(utils.find(global).dot(dot));
                        result = _.has(result, search) ? result[search] : (result || null);
                    }
                } else {
                    var scope;
                    if (data) scope = (_.has(data, search)) ? data[search] : data;
                    else if (global) scope = (_.has(global, search)) ? global[search] : global;
                    result = result || this._parser(scope);
                    result = result ? (_.has(result, search) ? result[search] : (result || null)) : null;
                }
            }
        } catch (err) {
            console.warn(err.stack || String(err));
        }
        return result || null;
    },
    _dot: function() {
        var settings = this._this.settings,
            keywords = settings.keywords(),
            search = this.key,
            result, data, global;
        try {
            if (!_.isEmpty(this.data)) {
                data = this.data || this.dive();
                global = this.dive() ? (_.has(this.dive(), keywords.global) ? this.dive()[keywords.global] : null) : null;
                result = this._parser(utils.find(data).dot(search)) || this._parser(utils.find(global).dot(search));

                result = this._parser(result);
            }
        } catch (err) {
            console.warn(err.stack || String(err));
        }
        return result || null;
    },
    _parser: function(obj) {
        if (obj) {
            var settings = this._this.settings,
                keywords = settings.keywords(),
                key = (this.locale() === settings.default()) ? keywords.default : keywords.translated;
            var result;
            if (_.isString(obj)) return obj;
            if (_.isPlainObject(obj)) {
                if (_.has(obj, key)) {
                    if (this.isSingular()) {
                        if (_.has(obj, keywords.singular))
                            result = _.has(obj[keywords.singular], key) ? obj[keywords.singular][key] : obj[keywords.singular][key] || null;
                    } else if (this.isPlural()) {
                        if (_.has(obj, keywords.plural))
                            result = _.has(obj[keywords.plural], key) ? obj[keywords.plural][key] : obj[keywords.plural][key] || null;
                    } else result = _.has(obj, key) ? obj[key] : obj;
                    return result;
                } else {
                    return this.isPlural() ? (obj[keywords.plural] || null) : null;
                }
            }
        }
    },
    regex: function(str) {
        var _this = this._this,
            self = this;
        return {
            dot: function() {
                var isDot;
                //http://stackoverflow.com/a/25799425/1251031
                if (!str) isDot = self.phrase.match(/\.[^.]/) && !self.phrase.match(/\s/) ? true : false;
                else isDot = str.match(/\.[^.]/) && !str.match(/\s/) ? true : false;
                return {
                    exec: function() {
                        if (isDot) return str ? str : _this.phrase;

                    },
                    match: function() {
                        return isDot;
                    }
                };
            },
            bracket: function() {
                var isDot = false,
                    isPhrase = false,
                    isBracket = false,
                    patterns = self.patterns;

                if (!str) {
                    if (patterns.dot.test(_this.phrase)) isDot = true;
                    if (patterns.phrase.test(_this.phrase) || patterns.phrase2.test(_this.phrase)) isPhrase = true;
                    if (patterns.brackdot.test(_this.phrase) || patterns.brackdot2.test(_this.phrase)) isBracket = true;
                } else {
                    if (patterns.dot.test(str)) isDot = true;
                    if (patterns.phrase.test(str) || patterns.phrase2.test(str)) isPhrase = true;
                    if (patterns.brackdot.test(str) || patterns.brackdot2.test(str)) isBracket = true;
                }

                return {
                    exec: function() {
                        if (!str) {
                            if (isDot) return patterns.dot.exec(_this.phrase);
                            else if (isPhrase) return patterns.phrase.exec(_this.phrase) || patterns.phrase2.exec(_this.phrase);
                            else if (isBracket) return patterns.brackdot.exec(_this.phrase) || patterns.brackdot2.exec(_this.phrase);
                        } else {
                            if (isDot) return patterns.dot.exec(str);
                            else if (isPhrase) return patterns.phrase.exec(str) || patterns.phrase2.exec(str);
                            else if (isBracket) return patterns.brackdot.exec(str) || patterns.brackdot2.exec(str);
                        }
                    },
                    match: function() {
                        return isDot || isPhrase || isBracket;
                    }
                };
            }
        }
    },
    filter: function(phrase) {
        //if the phrase contains brackets
        if (this.regex().bracket().match()) {
            //return the regex result and the type of parser
            return {
                key: this.regex().bracket().exec(),
                type: 'bracket'
            };
            //if the phrase contains dots
        } else if (this.regex().dot().match()) {

            return {
                key: phrase,
                type: 'dot'
            };
            //if the phrase is just something ordinary
        } else {
            return {
                key: phrase,
                type: 'phrase'
            };

        }
    },
    isSingular: function() {
        return this._this.values.count ? parseInt(this._this.values.count) === 1 : false;
    },
    isPlural: function() {
        return this._this.values.count ? parseInt(this._this.values.count) > 1 : false;
    },
    dive: function() {
        var settings = this._this.settings,
            router = this._this.router,
            data;
        if (settings.isRouter()) {
            if (router.toArray().length() === 0) data = this.data[router.toDot()];
            else data = dotParser(router.toDot(), this.data);
            return data;
        }
        return data || null;
    },
    locale: function() {
        var locale = this._this.values.locale,
            supported = this._this.settings.supported(),
            index = supported.indexOf(locale);
        if (!_.has(this.data, locale)) {
            this._this.io.read(locale);
            this.data = this._this.store.set(this._this.io).save();
        }
        return locale && supported[index] ? locale : this._this.accept.getLocale();
    },
    template: function(phrase) {
        var template = this._this.settings.template();
        if (S(phrase).include(template.open) && S(phrase).include(template.close)) {
            S.TMPL_OPEN = template.open;
            S.TMPL_ClOSE = template.close;
            return S(phrase).template(this._this.template).s;
        } else return phrase;
    },
    sprintf: function(phrase) {
        return vsprintf(phrase, this._this.args);
    }
});

module.exports = function() {
    //hack
    return function() {
        return parser.create(this);
    }
};
