/*jslint node: true, forin: true, jslint white: true, newcap: true*/
'use strict';

var Proto = require("uberproto");
var _ = require('lodash');

var version = /\d{1,2}(\.)\d{1,2}((\.)\d{1,2})?$/;

var router = Proto.extend({
    init: function(req) {
        this.path = req.path;
        this.originalUrl = req.originalUrl;
        this.subdomains = req.subdomains;
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
                //maybe something does exist besides ''? (precaution)
                result.push(path[1]);
            }
        } else {
            //for every item in the path
            //check to see if it contains a version or
            //if its a regular name. then add it to the 
            //filtered array
            _.forEach(path, function(item) {
                if (item.match(version)) {
                    //prevent the version dots from being
                    //interpreted as a dot notation
                    filtered.push(item.replace('.', '*'));
                } else {
                    filtered.push(item);
                }
            });

            path = filtered;
            //once we have filtered 
            for (var count = 1; count < path.length; count++) {
                if (count === 1) {
                    if (path[count] === '') {
                        result.push('index');
                    } else {
                        result.push(path[count]);
                    }
                } else {
                    //make sure nothing else is empty
                    if (path[count] !== '') {
                        result.push(path[count]);
                    }
                }
            }
        }
        return result;

    },
    toDot: function(array) {
        array = array ? array : this.toArray();
        if (array.length > 1) {
            return array.join().replace(/,/g, ".");
        } else {
            return array[0];
        }
    }

});

module.exports = function(req) {
    //convert input to array
    return router.create(req);
};
