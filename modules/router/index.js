/*jslint node: true, forin: true, jslint white: true, newcap: true*/

/**
 * Takeshi Iwana aka iwatakeshi
 * MIT 2015
 * accept-language.js
 * This module parses the routes
 * and sets the dot notation
 * according to the path.
 */

'use strict';

var Proto = require("uberproto");
var _ = require('lodash');
var cldr = require('cldr');

var Router = Proto.extend({
    init: function(req) {
        this.regex = {
            //versioning
            version: /\d{1,2}(\.)\d{1,2}((\.)\d{1,2})?$/,
        };
        this.set(req);
        return this;
    },
    set: function(req) {
        if (req) this.path = req.path;
            //TODO: Find a way to enable subdomain routing
            //this.subdomains = req.subdomains ? req.subdomains : this.headers.host;
        
    },
    toArray: function(path) {
        path = path ? path.split('/') : this.path.split('/');
        var filtered = [],
            result = [];

        if (path.length < 3) {
            //its safe to say that path[0] will always be ''
            //so add the second '' and define it as the index
            if (path[1] === '') {
                result.push('index');
            } else {
                //make sure the path does not contain a locale
                //and maybe something does exist besides ''? (precaution)
                if (!this.isLocale(path[1])) result.push(path[1]);
            }
        } else {
            //for every item in the path
            //check to see if it contains a version or
            //if its a regular name. then add it to the 
            //filtered array
            _.forEach(path, function(item) {
                //make sure the path does not contain a locale
                if (!this.isLocale(item))
                    if (item.match(this.regex.version)) {
                        //prevent the version dots from being
                        //interpreted as a dot notation
                        filtered.push(item.replace('.', '*'));
                    } else {
                        filtered.push(item);
                    }
            }, this);

            path = filtered;
            //once we have filtered 
            for (var count = 1; count < path.length; count++) {
                //make sure the path does not contain a locale
                if (!this.isLocale(path[count]))
                    if (count === 1) {
                        if (path[count] === '') result.push('index');
                        else result.push(path[count]);
                    } else {
                        //make sure nothing else is empty
                        if (path[count] !== '') result.push(path[count]);
                    }
            }
        }
        return result;

    },
    toDot: function(array) {
        array = array ? array : this.toArray();
        if (array.length > 1) return array.join().replace(/,/g, ".");
        else return array[0];
    },
    isLocale: function(str) {
        str = str.toLowerCase().replace('-', '_');
        return _.contains(cldr.localeIds, str);
    }

});

module.exports = function(req) {
    //convert input to array
    return Router.create(req);
};