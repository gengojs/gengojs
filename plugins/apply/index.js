var _ = require('lodash');

function Apply() {
  var object = arguments[0] || arguments[1] || {};
  var self = this;
  _.forEach(self._api(), function(item, key) {
    switch (key) {
      case 'i18n':
        _.forOwn(item, function(api, subkey) {
          if (!object[subkey]) {
            if (subkey === self.settings.globalID()) object[subkey] = api.bind(self);
            else object[self.settings.globalID()][subkey] = api.bind(self);
          } else {
            if (!this.isHapi()) console.warn('Global key already exists');
          }
        });
        break;
      case 'l10n':
        _.forOwn(item, function(api, subkey) {
          if (!object[subkey]) {
            if (subkey === self.settings.localizeID()) object[subkey] = api.bind(self);
          } else {
             if (!this.isHapi()) console.warn('Localize key already exists');
          }
        });
        break;
    }
  });
  this.gengo = object;
  return this.gengo;
}

module.exports = function() {
  var register = Apply;
  register.package = require('./package');
  return register;
}