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
                if (_.isPlainObject(p)) result = this.filterObject(p, v, a);

                break;
            case 2:
                //called like this: __('String', {Object})
                if (_.isString(p) && !_.isEmpty(v)) {
                    //make sure that the object doesn't contain a phrase
                    if (v['phrase']) delete v['phrase'];
                    result = this.filterObject(v, v, a);
                }
                //called like this: __({Object})
                if (_.isPlainObject(p)) {
                    //make sure that the object doesn't contain a phrase
                    if (v['phrase']) delete v['phrase'];
                    result = this.filterObject(p, v, a);
                }
                break;
            default:
                //assume it's greater than 2
                //meaning it's called like this: __(something, something, something)
                result = this.consolidate(p, a);
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
                    if (!p) p = item;
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
                if (v[key]) delete v[key];
            })
        } else {
            if (_.isPlainObject(o) && _.isPlainObject(v)) {
                //double check that values only has what it needs
                var temp = v;
                _.forOwn(temp, function(item, key) {
                    switch (key.toLowerCase()) {
                        case 'locale':
                            break;
                        case 'count':
                            break;
                        case 'sprintf':
                            //just in case it may not have been passed
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
                            //assume that it's for templating
                            t[key] = item;
                            delete v[key];
                            break;
                    }
                });
            }
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
    },
    consolidate: function(p, a) {
        var ptemp;
        var atemp = [];
        var vtemp = {};
        var ttemp = {};
        //called like this: __('String', something ...n)
        if (_.isString(p)) {
            ptemp = p;
            _.forEach(a, function(aitem, index) {
                if (_.isString(aitem) || _.isNumber(aitem)) atemp.push(aitem);
                if (_.isArray(aitem)) _.forEach(aitem, function(aitem2) {
                    if (!_.isPlainObject(aitem2)) atemp.push(aitem2);
                });
                if (_.isPlainObject(aitem)) _.forOwn(aitem, function(vitem, key) {
                    switch (key.toLowerCase()) {
                        case 'phrase':
                            //ignore
                            break;
                        case 'locale':
                            vtemp[key] = vitem;
                            break;
                        case 'sprintf':
                            if (_.isArray(vitem)) _.forEach(vitem, function(aitem2) {
                                atemp.push(aitem2);
                            });
                            else
                                atemp.push(aitem2);
                            break;
                        case 'count':
                            vtemp[key] = vitem;
                            break;
                        default:
                            ttemp[key] = vitem;
                            break;
                    }
                });
            });
        }

        if (_.isPlainObject(p)) {
            _.forOwn(p, function(item, key) {
                switch (key) {
                    case 'phrase':
                        if (!ptemp) ptemp = item;
                        break;
                    case 'locale':
                        vtemp[key] = item;
                        break;
                    case 'count':
                        vtemp[key] = item;
                        break;
                    case 'sprintf':
                        if (_.isArray(item)) _.forEach(item, function(aitem) {
                            if (!_.isPlainObject(aitem)) atemp.push(aitem);
                        });
                        else atemp.push(aitem);
                        break;
                    default:
                        ttemp[key] = item;
                        break;
                }
            });

            //now tackle the array
            _.forEach(a, function(aitem) {
                if (_.isString(aitem) || _.isNumber(aitem)) atemp.push(aitem);
                if (_.isArray(aitem)) _.forEach(aitem, function(aitem2) {
                    if (!_.isPlainObject(aitem2)) atemp.push(aitem2);
                });
                if (_.isPlainObject(aitem)) _.forOwn(aitem, function(vitem, key) {
                    switch (key.toLowerCase()) {
                        case 'phrase':
                            //ignore 
                            break;
                        case 'locale':
                            if (!vtemp[key]) vtemp[key] = vitem;
                            break;
                        case 'sprintf':
                            if (_.isArray(vitem)) _.forEach(vitem, function(aitem2) {
                                atemp.push(aitem2);
                            });
                            else
                                atemp.push(aitem2);
                            break;
                        case 'count':
                            if (!vtemp[key]) vtemp[key] = vitem;
                            break;
                        default:
                            if (!vtemp[key]) ttemp[key] = vitem;
                            break;
                    }
                });
            });
        }

        return {
            phrase: ptemp,
            values: vtemp,
            args: atemp,
            template: ttemp
        }
    }

}).create();

module.exports = function(phrase, values, args, length) {
    return filter.create(phrase, values, args, length);
};
