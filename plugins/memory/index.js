/*jslint node: true, forin: true, jslint white: true, newcap: true, curly: false*/
/**
 * Takeshi Iwana aka iwatakeshi
 * MIT 2015
 * io.js
 * This module handles the reading.
 */
var yaml = require('js-yaml');
var path = require('path');
var S = require('string');
var path = require('path');
var glob = require("glob");
var read = require('read-json');
var _ = require('lodash');

function Memory(settings, locale) {
 var temp = {};
  this.directory = path.normalize(settings.directory());
  this.prefix = settings.prefix;
  this.filePath = '';
  this.extension = settings.extension();
  this.data = {};
  this.set = function(callback) {
    var self = this;
    glob(this.directory + "/*" + this.extension, function(er, files) {
      if (!files) console.warn('Gengo.js - Uh oh! I coun\'t find those files! Are they missing?');
      else {
        _.forEach(files, function(file) {
          read(file, function(error, data) {
            temp[self.normalize(file.split('/').pop())] = data;
            //resurect this data!
            return callback(temp);
          });
        });
      }
    });
  };
  this.normalize = function(file) {
    return file.toLowerCase().replace(this.extension, '').replace('_', '-');
  }
  this.read = function(locale) {
    return this.data[locale];
  }
  //setter function
  function setter(data) {
    this.data = data;
  }
  this.set(setter.bind(this));
}

function memory() {
  this.backend = new Memory(this.settings);
  return this.backend;
}

module.exports = function() {
  var register = memory;
  register.package = require('./package');
  return register;
}