Gengo.js  
========

[![Build Status](https://travis-ci.org/iwatakeshi/gengojs.svg?branch=master)](https://travis-ci.org/iwatakeshi/gengojs)  [![Dependency Status](https://david-dm.org/iwatakeshi/gengojs.png)](https://github.com/iwatakeshi/gengojs/blob/master/package.json) [![License Status](http://img.shields.io/npm/l/gengojs.svg)](https://github.com/iwatakeshi/gengojs/blob/master/LICENSE) [![Downloads](http://img.shields.io/npm/dm/gengojs.svg)]() [![Version](http://img.shields.io/npm/v/gengojs.svg)]()

[![NPM](https://nodei.co/npm/gengojs.png?downloads=true&downloadRank=true&stars=true)](https://nodei.co/npm/gengojs/)



Visit [Gengojs.com](http://www.gengojs.com) for installation, configuration, and documentation.
Also, feel free to fork gengo and the site to add more languages and locale support!

To fork gengo visit http://www.github.com/iwatakeshi/gengojs

To fork the site visit http://www.github.com/iwatakeshi/gengojs-site

If you would like to see more examples other than the ones on gengojs.com then check out the tests there's 127+ possible ways to gengo!


###Coming soon
* Updated docs.

###Supported locales

The list is huge! See the [map file](https://github.com/iwatakeshi/gengojs/blob/master/maps/locales.js) for a list of locales.


###Supported file extensions:

* json

```json
{
  ...
}

```

* js (modulized json)

```js
module.exports = {
  //...
}

```

###Recent Changes
*For previous notes on changes, see CHANGELOG.md*

**0.3.35**

* Changed `cookiename` to `cookie`. Just simpler if you're coming from i18n.

**0.3.36**

* Changed how you enable debugging. You no longer need to pass a `level`object. Just pass an array `['warn', 'debug',...]
* gengo no longer cares whether you set your locale in uppercase or lowercase it will always return the locale as xx-XX or xx-XXX. Your filename should also be in that format.
* Added a huge list of supported locales. While it may seem dumb at first to have a file of locales, but actually gengo uses it to see if if a string is a locale or not so please add more locales if your locale is not supported yet.
* Added little support for Github markdown style. Specifically, italics, bold and strike.
* All tests still pass.
* Legacies will now have their own package.json so install the node modules at their located folder.
* Updated readme.

**0.3.37**

* Fixed markdown issues for bold and italics. Improved markdown for code and strike.
* Cleaned up some code in parse module.

**0.3.38**

* Added more custom markdown syntax. You can easily add twitter and site attributes links by simply using:

```markdown
[username or text](@username) --> https://www.twitter.com/username
[text](#name-of-attribute) --> href='#name-of-attribute'
```
**0.3.39**

* Fixed a bug if a requested locale is en then it should have fell back to en-US but it didn't.
* Sanitized more locales to make it easier to compare locales.
* Improved the way isDefault handles comparison with the default.

**0.3.40**

* Added travis ci, dependency badge, and travis badge and other badges.
* Fixed langs.js map file. Added tests for `language()`, `getLocale()`, `setLocale()`

###Notes

* Cache - gengo does cache if and only if the loaded objects are the same. If a change occurs, it will update the cached object. Tested with .json files.

###Message from the author

I want to thank those who tried or are actually are using gengo. Gengo was a learning curve but I know that this is just the beginning. As mentioned before, gengo still has room for improvement. I think better can be done but it's completely impossible without any feeback or contribution. If you would like to contribute, give feedback, or want to know how gengo works the please feel free to give me a holler at [@iwatakeshi](https://twitter.com/iwatakeshi). Again thanks! - iwatakeshi


###Tests
```bash
#run all
npm test

#run functions
npm run functions

#run cookies
npm run cookies

#run json
npm run json

#run libs
npm run libs

#run routes
npm run routes

#run api
npm run api

```

###Basic locale creator
```bash
#run factory
npm run factory
```

##Acknowledgements
gengo was made possible by:

* [locale](https://github.com/jed/locale)
* [App Root Path](https://github.com/inxilpro/node-app-root-path)
* [Moment.js](https://github.com/moment/moment)
* [Numeral.js](https://github.com/adamwdraper/Numeral-js)
* [underscore.js](https://github.com/jashkenas/underscore)
* [sprintf.js](https://github.com/alexei/sprintf.js)
* [xml2js](https://github.com/Leonidas-from-XIV/node-xml2js)
