/*jslint node: true, forin: true, jslint white: true, newcap: true, curly: false*/
/**
 * Takeshi Iwana aka iwatakeshi
 * MIT 2015
 * filter.js
 * This module filters the arguments
 * and organizes the input
 */
'use strict';

var Proto = require('uberproto'),
  _ = require('lodash'),
  regex = require('./regex');

var filter = Proto.extend({
  init: function(phrase, other, length) {
    this.phrase = '';
    this.values = {};
    this.args = [];
    this.template = {};
    return this;
  },
  type: function(phrase) {
    //if the phrase contains brackets
    if (regex(phrase).bracket().match()) {
      //return the regex result and the type of parser
      return {
        key: regex(phrase).bracket().exec(),
        type: 'bracket'
      };
      //if the phrase contains dots
    } else if (regex(phrase).dot().match()) {

      return {
        key: phrase,
        type: 'dot'
      };
      //if the phrase is just something ordinary
    } else {
      return {
        key: phrase,
        type: 'phrase'
      };

    }
  }
}).create();

module.exports = function(phrase, values, args, length) {
  return filter.create(phrase, values, args, length);
};
