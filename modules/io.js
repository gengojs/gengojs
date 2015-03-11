/*jslint node: true, forin: true, jslint white: true, newcap: true, curly: false*/
/**
 * Takeshi Iwana aka iwatakeshi
 * MIT 2015
 * io.js
 * This module handles the reading and writing of files.
 */

var Proto = require('uberproto');
var _ = require('lodash');
var yaml = require('js-yaml');
var fs = require('fs-extra');
var root = require('app-root-path');
var path = require('path');
var S = require('string');
var util = require('util');
var path = require('path');
var utils = require('./utils');

var io = Proto.extend({
    init: function(opt) {
        this.set(opt);
        return this;
    },
    set: function(opt) {
        if (opt) {
            this.cache = opt.cache || false;
            this.data = {};
            this.directory = opt.directory || path.normalize(root + '/locales');
            this.name = S(opt.name).trim().s || '';
            this.prefix = opt.prefix || '';
            if (!S(this.prefix).isEmpty()) this.name = S(this.prefix).trim().s + this.name;
            this.extension = opt.extension || 'json';
            this.filePath = '';
        }
        if (this.extension) {
            switch (this.extension) {
                case '.json':
                    this.json();
                    break;
                case '.yml':
                    this.yml();
                    break;
                case '.js':
                    this.js();
                    break;
            }
        }

        return this;
    },
    read: function(key) {
        if (key) {
            this.name = key;
            this.set();
            this.setFile();
        }
        switch (this.extension) {
            case '.json':
                this.data = fs.readJsonSync(this.filePath, {
                    throws: false
                });
                if (!this.data) {
                    this.setFile(true)
                    fs.readJsonSync(this.filePath, {
                        throws: false
                    });
                }
                break;
            case '.js':
                if (!this.cache) this.data = require(this.filePath);
                else {
                    try {
                        try {
                            this.data = require(this.filePath);
                            utils.require.uncache(this.filePath);
                        } catch (err) {
                            //not found?
                        } finally {
                            //maybe it's in lower case
                            this.setFile(true);
                            this.data = require(this.filePath);
                            utils.require.uncache(this.filePath);
                        }
                    } catch (err) {
                        //sorry didn't find it
                    }

                }
                break;
            case '.yml':
                try {
                    try {
                        this.data = yaml.safeLoad(fs.readFileSync(this.filePath, 'utf8'));
                    } catch (err) {

                    } finally {
                        this.setFile(true);
                        this.data = yaml.safeLoad(fs.readFileSync(this.filePath, 'utf8'));
                    }
                } catch (err) {
                    console.log(err.stack || String(err));
                }
                break;
        }
        return this.data;
    },
    /** YAML handler */
    yml: function() {
        this.extension = this.extension;
        this.setFile();
        return this;
    },
    /** JSON handler */
    json: function() {
        this.extension = '.json';
        this.setFile();
        return this;
    },
    /** Javascript handler */
    js: function() {
        this.extension = '.js';
        this.setFile();
        return this;
    },
    setFile: function(lowercase) {
        if (lowercase) this.name = this.name.toLowerCase();
        this.file = this.name + this.extension;
        this.filePath = path.normalize(path.join(this.directory, this.file));
    }
});

//will eventually work like this: io(opt).yaml().read()
module.exports = function(opt) {
    return io.create(opt);
}
