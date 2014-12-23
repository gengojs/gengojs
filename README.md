gengo.js  
========

[![Build Status](https://travis-ci.org/iwatakeshi/gengojs.svg?branch=master)](https://travis-ci.org/iwatakeshi/gengojs)  [![Dependency Status](https://david-dm.org/iwatakeshi/gengojs.png)](https://github.com/iwatakeshi/gengojs/blob/master/package.json) [![License Status](http://img.shields.io/npm/l/gengojs.svg)](https://github.com/iwatakeshi/gengojs/blob/master/LICENSE) [![Downloads](http://img.shields.io/npm/dm/gengojs.svg)]() [![Version](http://img.shields.io/npm/v/gengojs.svg)]()

[![NPM](https://nodei.co/npm/gengojs.png?downloads=true&downloadRank=true&stars=true)](https://nodei.co/npm/gengojs/)

##News Flash

*10/30/14*

The site for gengo.js has been improved! Of course, typos may exist and will be fixed along the way.
This means that I will not translate it until the site seems stable enough.

*12/11/14*

Sorry folks! I've been busy with finals and will now have some time to work on gengojs's site. To me, the site seems reasonably stable enough so I will be begin translating it sometime next week. Currently, I'm working on some interesting projects so if interested check them out at [my GitHub page](https://github.com/iwatakeshi). One final note: If you are not satisfied with gengo.js (or the website) by the way it works or by its designed, do not hesitate the pull or fork this project for contribution. Since the project is free of charge, I will not be bothered if someone breaks the code. In fact, break it! then improve it! Anyways happy coding! - Takeshi

Visit [gengojs.com](http://www.gengojs.com) for installation, configuration, and documentation.
Also, please fork gengo and the site to add more languages and locale support!

To fork gengo visit http://www.github.com/iwatakeshi/gengojs

To fork the site visit http://www.github.com/iwatakeshi/gengojs-site

If you would like to see more examples other than the ones on gengojs.com then check out the tests there are 127+ possible ways to gengo!


*12/22/14*

Merry Christmas! This is an early Christmas gift from me to you! Yup! It's an update! So whats new? Check out the **Recent Changes**! You'll notice there are a few changes to gengojs. Other than that the website for gengojs has been translated to Japanese. If you would
like to add your language to the docs, please please please (with dogeza) fork the site and translate the `en-us.json` file located under `'/config/locales'` to your language. On that note, take your time. I've had visitors from around the world and that really inspires me to support this project, but
it's been a one man show so I need all the support that I can get from the nodejs community. 

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

**0.3.59**

* Updated node modules (tests pass)

**0.3.60**

* Added a Visual Studio solution

**0.3.61**

* gengo.js will now give a "safe" error message when router is enabled. The message will appear when a route is missing in your dictionary. Note that the server will not crash but the page will display properly as gengo returns the original phrase instead.
* Updated readme

**0.3.62**

* Fixed markdown bug and disabled markdown by default
* Added markdown to option
* Added markdown tests (more to come)
* Updated readme
* Updated site to reflect changes and also the site has been translated
* Updated error message in parse

###Tests

```bash
#make sure to install the node modules
npm install
```


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

#run markdown
npm run markdown

```

##Acknowledgements

gengo was made possible by:

* [App Root Path](https://github.com/inxilpro/node-app-root-path)
* [Moment.js](https://github.com/moment/moment)
* [Numeral.js](https://github.com/adamwdraper/Numeral-js)
* [lodash.js](https://github.com/lodash/lodash)
* [kawari.js](https://github.com/iwatakeshi/kawarijs)
* [mustache.js](https://github.com/janl/mustache.js)
