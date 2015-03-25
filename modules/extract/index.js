/*jslint node: true, forin: true, jslint white: true, newcap: true*/

/**
 * Takeshi Iwana aka iwatakeshi
 * MIT 2015
 * extract.js
 * This module extracts the input
 * and organizes them into two parts:
 *  - values
 *  - args
 *  Credits to @mashpie for the idea
 */

'use strict';

var Proto = require("uberproto");
var _ = require('lodash');

/**
 * @constructor Extract
 * @param  {Array} array The array to extract.
 * @return {Extract}     The instance of Extract.
 */
var Extract = Proto.extend({
  /**
   * @method init
   * @description Initializes the constructor.
   * @param  {Array} array The array to extract
   * @return {Extract}     The instance of Extract.
   * @private
   */
  init: function(array, length) {
    var values = {},
      args = [],
      value;
    //if the arguments is greater than 2 (because of offset)
    if (length > 2) {
      //just append them to the array
      _.forEach(array, function(item) {
        args.push(item);
      });
    }
    //if they are exactly 2 argument
    else if (length === 2) {
      //get the first value
      value = array[0];
      //set arguments [...]
      if (_.isArray(value)) args = value;
      else if (_.isObject(value)) args = [];
      else args.push(value);
      //set values {...}
      values = _.isObject(value) ? value : {};
    }

    this._values = values;
    this._args = args;
    return this;
  },
  /**
   * @method values
   * @description Returns the extracted values.
   * @return {Object} The values.
   * @public
   */
  values: function() {
    return this._values;
  },
  /**
   * @method hasValues
   * @description Checks if values is not empty.
   * @return {Boolean} The validity of values.
   * @public
   */
  hasValues: function() {
    return !_.isEmpty(this._values);
  },
  /**
   * @method args
   * @description Returns the extracted arguments.
   * @return {Object} The arguments.
   * @public
   */
  args: function() {
    return this._args;
  },
  /**
   * @method hasArgs
   * @description Checks if args is not empty.
   * @return {Boolean} The validity of args.
   * @public
   */
  hasArgs: function() {
    return !_.isEmpty(this._args);
  }
});
/** 
 * @method extract
 * @param  {Array} args The arguments from the function.
 * @return {Extract}     The instance of Extract.
 */
module.exports = function extract(args, length) {
  return Extract.create(Array.prototype.slice.call(args, 1), length);
};
