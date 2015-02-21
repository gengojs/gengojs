/*jslint node: true, forin: true, jslint white: true, newcap: true*/

/**
 * Takeshi Iwana aka iwatakeshi
 * MIT 2015
 * filter.js
 * This module sets the middleware
 */

'use strict';

var Proto = require("uberproto");
var _ = require('lodash');
var flatten = require('./utils').flatten;
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
            }
        }

        var callbacks = flatten(slice.call(arguments, offset));
        if (callbacks.length === 0) {
            throw new TypeError('gengo.use() requires middleware functions');
        }

        callbacks.forEach(function(fn) {
            if (typeof fn !== 'function') {
                throw new TypeError('gengo.use() requires middleware function but got a ' + typeof fn);
            }
            self.stack.push(fn);
        }, this);

        return this;
    }
}).create();


module.exports = function(fn) {
    //convert input to array
    return middleware.use(fn);
};
