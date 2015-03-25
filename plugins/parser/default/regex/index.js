/*jslint node: true, forin: true, jslint white: true, newcap: true, curly: false*/
var Proto = require('uberproto');

var Regex = Proto.extend({
  init: function(str) {
    //set string
    this.str = str;
    //set patterns
    this.patterns = {
      dot: new RegExp(/^\[([a-zA-Z0-9\.]+)\]\.([a-zA-Z0-9\.]+)/),
      phrase: new RegExp(/^\[([\s\S]+)\]\.([a-zA-Z0-9\.]+)/),
      phrase2: new RegExp(/^\[(.*)\]/),
      brackdot: new RegExp(/^\[([a-zA-Z0-9\.]+)\]\.([a-z\.]+)/),
      brackdot2: new RegExp(/^\[([a-zA-Z0-9\.]+)\]/)
    };
  },
  dot: function() {
    //http://stackoverflow.com/a/25799425/1251031
    var isDot = this.str.match(/\.[^.]/) && !this.str.match(/\s/) ? true : false;
    var self = this;
    return {
      exec: function() {
        if (isDot) return self.str;
      },
      match: function() {
        return isDot;
      }
    };
  },
  bracket: function() {
    var isDot = false,
      isPhrase = false,
      isBracket = false,
      patterns = this.patterns;

    if (patterns.dot.test(this.str)) isDot = true;
    if (patterns.phrase.test(this.str) || patterns.phrase2.test(this.str)) isPhrase = true;
    if (patterns.brackdot.test(this.str) || patterns.brackdot2.test(this.str)) isBracket = true;

    var self = this;
    return {
      exec: function() {
        if (isDot) return patterns.dot.exec(self.str);
        else if (isPhrase) return patterns.phrase.exec(self.str) || patterns.phrase2.exec(self.str);
        else if (isBracket) return patterns.brackdot.exec(self.str) || patterns.brackdot2.exec(self.str);
      },
      match: function() {
        return isDot || isPhrase || isBracket;
      }
    };
  }
});

module.exports = function(str) {
  return Regex.create(str);
};
