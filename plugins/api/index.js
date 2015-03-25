var cldr = require('cldr');
function api() {
  var i18n = function() {};
  var l10n = function() {};
  /**
   * @method i18n
   * @description I18ns the arguments.
   * Note: You can change ID for i18n. See Configuration.
   * @param  {...*} arg The arguments to internationalize.
   *
   * @example <caption>Phrase notation with default parser.</caption>
   *
   * // assuming the locale === 'ja',
   * // a basic phrase returns 'こんにちは'
   * __('Hello');
   *
   * // a basic phrase with sprintf returns 'Bob こんにちは'
   * __('Hello %s', 'Bob');
   *
   * // a basic phrase with interpolation returns 'Bob こんにちは'
   *  __('Hello {{name}}', {name:'Bob'});
   *
   * @example <caption>Bracket notation with default parser.</caption>
   *
   * // assuming the locale === 'ja',
   * // a basic bracket phrase returns 'おっす'
   * __('[Hello].informal');
   *
   * // a basic bracket phrase with sprintf returns 'Bob おっす'
   * __('[Hello %].informal', 'Bob');
   *
   * // a basic bracket phrase with interpolation returns 'Bob おっす'
   * __('[Hello {{name}}].informal', {name:'Bob'});
   *
   * @example <caption>Dot notation with default parser.</caption>
   *
   * // assuming the locale === 'ja',
   * // a basic dot phrase returns 'おっす'
   * __('greeting.hello.informal');
   *
   * // a basic dot phrase with sprintf returns 'Bob おっす'
   * __('greeting.hello.person.informal', 'Bob');
   *
   * //a basic dot phrase with interpolation returns 'Bob おっす'
   * __('greeting.hello.person.informal', {name:'Bob'});
   *
   * @example <caption>All notations with Message Format.</caption>
   * // See '{@link https://github.com/thetalecrafter/message-format|message-format}' for documentation.
   *
   * // assuming the locale === 'en-us',
   * // a basic phrase with message formatting
   * // returns "You took 4,000 pictures since Jan 1, 2015 9:33:04 AM"
   * __('You took {n,number} pictures since {d,date} {d,time}', { n:4000, d:new Date() });
   *
   * // a basic bracket phrase with message formatting
   * // returns "You took 4,000 pictures since Jan 1, 2015 9:33:04 AM"
   * __('[You took {n, numbers} pictures].since.date', { n:4000, d:new Date() });
   *
   * // a basic dot phrase with message formatting
   * // returns "You took 4,000 pictures since Jan 1, 2015 9:33:04 AM"
   * __('pictures.since.date', { n:4000, d:new Date() });
   *
   * @return {String} Then i18ned string.
   * @public
   */

  i18n[this.settings.globalID()] = function(arg) {
    return this.parse.apply(this, arguments);
  };
  /**
   * @method language
   * @description Returns the name of the current locale.
   * @param  {string} id The locale to change.
   *
   * @example <caption>Get the current language.</caption>
   *
   * // assuming locale === 'en-us'
   * // returns 'American English'
   * __.languages();
   *
   * @example <caption>Get the current language in another locale. </caption>
   *
   * // assuming locale === 'en-us'
   * // returns 'English'
   * __.language('en');
   *
   * // returns 'Japanese'
   * __.language('ja');
   *
   * @return {String} Then i18ned string.
   * @public
   */
  i18n.language = function(id) {
    // de-normalize locale
    var locale = this.accept.getLocale().replace('-', '_');
    // denormalize id
    id = id ? id.toLowerCase().replace('-', '_') : locale;
    // store the languages
    return cldr.extractLanguageDisplayNames(locale)[id];
  };
  /**
   * @method languages
   * @description Returns the names of the supported locale.
   * @param  {String | Array} arg The locale to change or the supported locales.
   * @param {Array} supported The supported locales.
   *
   * @example <caption>Get the supported languages.</caption>
   *
   * // assuming locale === 'en-us'
   * // returns ['American English', 'Japanese']
   * __.lanugages();
   *
   * @example <caption>Get the current languages in another locale. </caption>
   *
   * // assuming locale === 'en-us'
   * // returns ['アメリカ英語', '日本語']
   * __.languages('ja');
   *
   * @example <caption>Override the supported locales.</caption>
   *
   * // assuming locale === 'en-us'
   * // returns ['English', 'Japanese']
   * __.languages(['en', 'ja']);
   *
   * @example <caption>Override the supported locales and get the languages in another locale.</caption>
   *
   * // assuming locale === 'en-us'
   * // returns ['英語', '日本語']
   * __.languages('ja', ['en', 'ja']);
   *
   * @return {String} Then i18ned string.
   * @public
   */
  i18n.languages = function(arg, supported) {
    var _supported = [];
    supported = (_.isArray(arg) ? arg : supported) || this.settings.supported();
    arg = _.isArray(arg) ? undefined : arg;
    _.forEach(supported, function(locale) {
      // de-normalize locales
      locale = locale.replace('-', '_');
      // denormalize arg
      arg = arg ? arg.toLowerCase().replace('-', '_') : this.accept.getLocale().replace('-', '_');
      // store the languages
      _supported.push(cldr.extractLanguageDisplayNames(arg)[locale]);
    }, this);
    return _supported;
  };

  /**
   * @method locales
   * @description Sets or gets the locale.
   * @param  {String} locale The locale to set or get.
   *
   * @example <caption>Get the current locale.</caption>
   *
   * // assuming locale === 'en-us'
   * // returns 'en-us'
   * __.locale()
   *
   * @example <caption>Set the locale.</caption>
   *
   * // asumming locale === 'en-us'
   * // sets and returns 'ja'
   * __.locale('ja')
   *
   * @return {String} The locale.
   * @public
   */
  i18n.locale = function(locale) {
    return locale ? this.accept.setLocale(locale) : this.accept.detectLocale();
  };

  /**
   * @description Get the entire
   * @return {CLDR} The instance of cldr.
   */
  i18n.cldr = function() {
    return cldr;
  };

  /**
   * @method l10n
   * @description Localizes date, time and numbers.
   * See {@link https://github.com/iwatakeshi/tokei|Tokei} for documentation.
   * Note: You can change ID for l10n. See Configuration.
   * @param  {String}  locale The locale to override.
   * @return {Tokei} The instance of Tokei.
   * @public
   */
  l10n[this.settings.localizeID()] = function() {
    return this.localize.apply(this, arguments);
  };

  this.api = {
    i18n: i18n,
    l10n: l10n
  };
}

module.exports = function() {
  var register = api;
  register.package = require('./package');
  return register;
}