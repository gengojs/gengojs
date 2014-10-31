gengo.js  
========

[![Build Status](https://travis-ci.org/iwatakeshi/gengojs.svg?branch=master)](https://travis-ci.org/iwatakeshi/gengojs)  [![Dependency Status](https://david-dm.org/iwatakeshi/gengojs.png)](https://github.com/iwatakeshi/gengojs/blob/master/package.json) [![License Status](http://img.shields.io/npm/l/gengojs.svg)](https://github.com/iwatakeshi/gengojs/blob/master/LICENSE) [![Downloads](http://img.shields.io/npm/dm/gengojs.svg)]() [![Version](http://img.shields.io/npm/v/gengojs.svg)]()

[![NPM](https://nodei.co/npm/gengojs.png?downloads=true&downloadRank=true&stars=true)](https://nodei.co/npm/gengojs/)

##News Flash

*10/30/14*

The site for gengo.js has been improved! Of course, typos may exist and will be fixed along the way.
This means that I will not translate it until the site seems stable enough.

Visit [gengojs.com](http://www.gengojs.com) for installation, configuration, and documentation.
Also, please fork gengo and the site to add more languages and locale support!

To fork gengo visit http://www.github.com/iwatakeshi/gengojs

To fork the site visit http://www.github.com/iwatakeshi/gengojs-site

If you would like to see more examples other than the ones on gengojs.com then check out the tests there are 127+ possible ways to gengo!

###Recent Changes

*For previous notes on changes, see CHANGELOG.md*

**0.3.55**

* Added support for file prefix
* Changed gengo's description in package.json
* Added support for plain object options for debugging. This will allow you to add timestamps. see [cout](https://github.com/iwatakeshi/cout)
* Updated node modules for sails apps.

**0.3.56**

* Added an instance of gengo to itself. Similar to i18n's method.
* Revamped site. Completely better...waaay better. Visit now!
* Final change to npm's description.
* Removed legacies. Support for v0.2 ends.
* Removed factory support.

**0.3.57**

* Fixed typo in readme.

**0.3.58**

* Updated readme.

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

##Acknowledgements

gengo was made possible by:

* [App Root Path](https://github.com/inxilpro/node-app-root-path)
* [Moment.js](https://github.com/moment/moment)
* [Numeral.js](https://github.com/adamwdraper/Numeral-js)
* [lodash.js](https://github.com/lodash/lodash)
* [kawari.js](https://github.com/iwatakeshi/kawarijs)
* [mustache.js](https://github.com/janl/mustache.js)
