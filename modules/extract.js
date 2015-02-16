/*jslint node: true, forin: true, jslint white: true, newcap: true*/
'use strict';

var Proto = require("uberproto");
var _ = require('lodash');

var extract = Proto.extend({
    init: function(array) {
        var values = {},
            args = [];
        //Credits to @mashpie for the idea
        //store everything in args when argumnets > 1
        //also ignore the first argument
        if (array.length > 1) {
            _.forEach(array, function(item) {
                args.push(item);
            });
            values = {};
        } else if (array.length === 1) {
            //for some reason, you must check if its an array first
            if (_.isArray(array[0])) {
                values = {};
                args = array[0];
            } else if (_.isObject(array[0])) {
                values = array[0];
                args = [];
            } else {
                values = {};
                args.push(array[0]);
            }
        }
        this.value = values;
        this.arg = args;
    },
    //return the values and args
    values: function() {
        return this.value;
    },
    hasValues: function() {
        return !_.isEmpty(this.value);
    },
    args: function() {
        return this.arg;
    },
    hasArgs: function() {
        return !_.isEmpty(this.arg);
    }
});

module.exports = function(input) {
    //convert input to array
    return extract.create(Array.prototype.slice.call(input, 1));
};
