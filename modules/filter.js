/**
 * Takeshi Iwana aka iwatakeshi
 * MIT 2015
 * filter.js
 * This module filters the arguments
 * and organizes the input
 */

var Proto = require('uberproto');
var _ = require('lodash');
var normalize = require('./utils').normalize;
var isInteger = require('./utils').isInteger;
var filter = Proto.extend({
    init: function(phrase, values, args, length) {
        this.phrase = '';
        this.values = {};
        this.args = [];
        this.length = 0;
        this.template = {};
        if (length > 0 || !_.isArray(phrase) || !_.isNumber(phrase)) this.discern(phrase, values, args, length);
        return this;
    },
    discern: function(phrase, values, args, length) {
        var p = phrase,
            v = values,
            a = args,
            l = length,
            t, /*template*/
            result;

        //start checking the lengths
        switch (l) {
            case 1:
                //called like this: _({Object})
                if (p && !_.isString(p) && _.isPlainObject(p)) {
                    result = this.filterObject(p, v, a);
                }
                break;
            case 2:
                //called like this: __('String', 'String')
                //note that the second String is strict
                //therefore, 1.0.0 will no longer parse integers
                //from strings
                //...skip since it's already taken care of

                //called like this: __('String', {Object})
                if (_.isString(p) && !_.isEmpty(v)) {
                    //make sure that the object doesn't contain a phrase
                    if (v['phrase']) delete v['phrase'];
                    result = this.filterObject(v, v, a);
                }

                //called like this: __('String', [Array])
                //...skip since it's already taken care of

                //called like this: __('String', Number)
                //note that numbers will be considered sprintf but
                //not as count in 1.0.0
                //...skip since it's already taken care of

                //called like this: __({Object}, 'String')
                //...skip since it's already taken care of

                //called like this: __({Object}, {Object})
                //...skip since it's already taken care of

                if (!_.isString(p) && _.isPlainObject(p)) {
                    //make sure that the object doesn't contain a phrase
                    if (v['phrase']) delete v['phrase'];
                    result = this.filterObject(p, v, a);
                }
                //called like this: __({Object}, [Array])
                //...skip since it's already taken care of
                //called like this: __({Object}, Number)
                //...skip since it's already taken care of
                //
                break;
            default:
                //assume it's greater than 2
                //meaning it's called like this: __(something, something, something)

                //could the 
                break;
        }

        this.phrase = result ? (result.phrase || p) : p;
        this.values = result ? (result.values || v) : v;
        //filter the array so it does not contain any objects
        this.args = result ? (this.filterArray(result) || this.filterArray(a)) : this.filterArray(a);
        this.template = result ? (result.template || t) : t;
    },
    filterObject: function(o, v, a) {
        var p,
            t = {};
        _.forOwn(o, function(item, key) {
            switch (key.toLowerCase()) {
                case 'phrase':
                    p = item;
                    break;
                case 'locale':
                    v[key] = item;
                    break;
                case 'count':
                    v[key] = item;
                    break;
                case 'sprintf':
                    if (_.isArray(item)) {
                        _.forEach(item, function(aitem) {
                            a.push(aitem);
                        });
                    } else {
                        a.push(item);
                    }

                    break;
                default:
                    t[key] = item;
                    break;
            }
        });

        if (_.isEqual(o, v)) {
            //remove anything in values that may be in templates
            _.forEach(t, function(item, key) {
                if (v[key]) {
                    delete v[key];
                }
            })
        }

        if (_.isPlainObject(o) && _.isPlainObject(v) && !_.isEqual(o, v)) {
            //double check that values only has what it needs
            var temp = v;
            _.forOwn(temp, function(item, key) {
                switch (key.toLowerCase()) {
                    case 'locale':
                        break;
                    case 'count':
                        break;
                    case 'sprintf':
                        if (_.isArray(item)) {
                            _.forEach(item, function(aitem) {
                                a.push(aitem);
                            });
                        } else {
                            a.push(item);
                        }
                        delete v[key];
                        break;
                    default:
                        t[key] = item;
                        delete v[key];
                        break;
                }
            });
        }
        return {
            phrase: p,
            values: v,
            args: a,
            template: t
        }
    },
    filterArray: function(a) {
        var temp;
        if (a) {
            temp = _.isPlainObject(a) ? a.args : a;
            _.forEach(temp, function(item, index) {
                //remove anything that is an object in the array
                if (_.isPlainObject(item) || _.isObject(item)) {
                    //'a' could be the result or an array
                    if (_.isPlainObject(a)) {
                        a.args.splice(index, 1);
                    } else {
                        a.splice(index, 1);
                    }

                }
            });
        }
        return temp;
    }

}).create();

module.exports = function(phrase, values, args, length) {
    return filter.create(phrase, values, args, length);
};
