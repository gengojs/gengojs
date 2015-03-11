var Proto = require('uberproto');
var _ = require('lodash');
var S = require('string');
var Template = Proto.extend({
    init: function(phrase, template, settings) {
        this.phrase = phrase;
        this.open = settings.open;
        this.close = settings.close;
        this.template = template;
    },
    parse: function() {
        if (S(this.phrase).include(this.open) && S(this.phrase).include(this.close)) {
            var opening = this.open;
            var closing = this.close;

            var open = opening.replace(/[-[\]()*\s]/g, "\\$&").replace(/\$/g, '\\$')
            var close = closing.replace(/[-[\]()*\s]/g, "\\$&").replace(/\$/g, '\\$')
            var r = new RegExp(open + '(.+?)' + close, 'g')
                //, r = /\{\{(.+?)\}\}/g
            var matches = this.phrase.match(r) || [];
            _.forEach(matches, function(match) {
                var keys = match.substring(opening.length, match.length - closing.length).trim().split('.'); //chop {{ and }}
                var value = this.find(this.template, keys);
                this.phrase = this.phrase.replace(match, value);
            }, this)
        }
        return this.phrase;
    },
    //http://adripofjavascript.com/blog/drips/making-deep-property-access-safe-in-javascript.html
    find: function(obj, property) {
        if (!obj) {
            return '';
        }
        if (property.length === 0) {
            return obj;
        }
        var found = obj[property[0]];
        var remainder = property.slice(1);
        return this.find(found, remainder);
    }
});

module.exports = function(phrase, template, settings) {
    return Template.create(phrase, template, settings);
}
