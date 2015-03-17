/*jslint node: true, forin: true, jslint white: true, newcap: true, curly: false*/
/**
 * Takeshi Iwana aka iwatakeshi
 * MIT 2015
 * filter.js
 * This module filters the arguments
 * and organizes the input
 */
'use strict';

var Proto = require('uberproto'),
    _ = require('lodash'),
    regex = require('./regex');

var filter = Proto.extend({
    init: function(phrase, other, length) {
        this.phrase = '';
        this.values = {};
        this.args = [];
        this.template = {};
        if (length > 0 || !_.isArray(phrase) || !_.isNumber(phrase)) this.discern(phrase, other);
        return this;
    },
    discern: function(phrase, other) {
        //maybe phrase is an plain object
        if (_.isPlainObject(phrase) || _.isObject(phrase)) {
            _.forOwn(phrase, function(item, key) {
                switch (key) {
                    case 'phrase':
                        this.phrase = phrase[key];
                        delete phrase[key];
                        break;
                    case 'locale':
                    case 'count':
                        if (!this.values[key]) this.values[key] = item;
                        break;
                    default:
                        if (!this.template[key]) this.template[key] = item;
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
                        case 'count':
                            if (!this.values[key]) this.values[key] = item;
                            break;
                        default:
                            if (!this.template[key]) this.template[key] = item;
                            break;
                    }
                }, this);
            //check that args only contains strings or numbers
            if (!_.isEmpty(other.args()))
                _.forEach(other.args(), function(item) {
                    if (!_.isPlainObject(item)) this.args.push(item);
                    else {
                        _.forOwn(item, function(item, key) {
                            switch (key) {
                                case 'locale':
                                case 'count':
                                    if (!this.values[key]) this.values[key] = item;
                                    break;
                                default:
                                    if (!this.template[key]) this.template[key] = item;
                                    break;
                            }
                        }, this);
                    }
                }, this);
        }
        return this;
    },
    type: function(phrase) {
        //if the phrase contains brackets
        if (regex(phrase).bracket().match()) {
            //return the regex result and the type of parser
            return {
                key: regex(phrase).bracket().exec(),
                type: 'bracket'
            };
            //if the phrase contains dots
        } else if (regex(phrase).dot().match()) {

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
    }
}).create();

module.exports = function(phrase, values, args, length) {
    return filter.create(phrase, values, args, length);
};
