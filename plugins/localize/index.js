var tokei = require('tokei');

function localize() {
  tokei.locale(this.accept.detectLocale());
  this.localize = tokei;
  return this.localize;
}

module.exports = function() {
  var register = localize;
  register.package = require('./package');
  return register;
}