var Proto = require('uberproto');
var _ = require('lodash');

var utils = Proto.extend({
    init: function() {

    },
    normalize: function normalize(str) {
        var str = str.toLowerCase();
        if (str.indexOf('_') > -1) {
            str = str.replace('_', '-');
        }
        return str;
    },
    isInteger: function isInteger(value) {
        if (_.isString(value)) return false;

        if ((undefined === value) || (null === value)) {
            return false;
        }
        return value % 1 == 0;
    }
}).create();

module.exports = utils;
