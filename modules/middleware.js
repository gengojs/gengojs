/*jslint node: true, forin: true, jslint white: true, newcap: true*/
'use strict';

var Proto = require("uberproto");
var _ = require('lodash');

/**
    Utils
 */

function flatten(arr, ret) {
    ret = ret || [];
    var len = arr.length;
    for (var i = 0; i < len; ++i) {
        if (_.isArray(arr[i])) {
            exports.flatten(arr[i], ret);
        } else {
            ret.push(arr[i]);
        }
    }
    return ret;
};
var slice = Array.prototype.slice;

//https://github.com/strongloop/express/blob/master/lib/router/index.js#L418
var middleware = Proto.extend({
    init: function() {
        this.stack = [];
    },
    use: function(fn) {
        var self = this;
        var offset = 0;

        // disambiguate middleware.use([fn])
        if (typeof fn !== 'function') {
            var arg = fn;

            while (_.isArray(arg) && arg.length !== 0) {
                arg = arg[0];
            }

            // first arg is the middleware
            if (typeof arg !== 'function') {
                offset = 1;
                parser = fn;
            }
        }

        var callbacks = flatten(slice.call(arguments, offset));
        if (callbacks.length === 0) {
            throw new TypeError('gengo.use() requires middleware functions');
        }

        callbacks.forEach(function(fn) {
            if (typeof fn !== 'function') {
                throw new TypeError('gengo.use() requires middleware function but got a ' + gettype(fn));
            }

            // add the middleware
            //debug('use %s %s', path, fn.name || '<anonymous>');
            self.stack.push(fn);
        }, this);

        return this;
    }
}).create();


module.exports = function(fn) {
    //convert input to array
    return middleware.use(fn);
};
