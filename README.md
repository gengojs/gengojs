gengo.js  
========

[![Build Status](https://travis-ci.org/iwatakeshi/gengojs.svg?branch=master)](https://travis-ci.org/iwatakeshi/gengojs)  [![Dependency Status](https://david-dm.org/iwatakeshi/gengojs.png)](https://github.com/iwatakeshi/gengojs/blob/master/package.json) [![License Status](http://img.shields.io/npm/l/gengojs.svg)](https://github.com/iwatakeshi/gengojs/blob/master/LICENSE) [![Downloads](http://img.shields.io/npm/dm/gengojs.svg)]() [![Version](http://img.shields.io/npm/v/gengojs.svg)]()

[![NPM](https://nodei.co/npm/gengojs.png?downloads=true&downloadRank=true&stars=true)](https://nodei.co/npm/gengojs/)

##News Flash

*5/11/2015*

Slowly but surely gengo.js will be arriving to the state of completion. Here's what happened:

* The core has been [reduced to 55 loc](https://github.com/iwatakeshi/gengojs-core/blob/master/lib/core/index.js).
  * This means you can rest assure that the core doesn't have bugs.
  * This means you can focus on the plugins
* All plugins have been completed.
  * TODO: Create a pack and test all the features

Here is what is going to happen in the near future:

  * Release gengojs 1.0.0-alpha.1
  * Rewrite the docs

Here is what you need to know about the changes:

   * [Core](https://github.com/iwatakeshi/gengojs-core)
      * As mentioned before, gengo.js will completely be pluggable.
   * [Parser](https://github.com/iwatakeshi/gengojs-default-parser)
      * It was a difficult decision but I decided not to support plurality for sprintf and interpolation. This does not mean you can't change that. I have given you three options to overcome this problem:
        * Use message formatting along with sprintf and interpolation
        * Create your own parser plugin
        * The default parser gives multiple options to override some internal functions. I will include this in the docs.
   * [API](https://github.com/iwatakeshi/gengojs-default-api)
      * globalize
        * Added `language()` and is now powered by cldr.
        * Added `langauges()`
        * Removed `setLocale()` and `getLocale()` and replaced with `locale()` for setter and getter
        * Added `catalog()`
      * localize
        * Localization is now powered by [Tokei](https://github.com/iwatakeshi/tokei).
          * This will allow you to use date, time, and number formatting.


*3/30/2015*

The progress of gengo.js (gengojs or gengo for short) is **amazing**. Unfortunately, I will be doing less work on it until May or so but before doing so, I thought to give you an update on what exactly happened and here's the list:

**What exactly happened...**

* The _**core**_ of Gengo is now on its own and [**small**](https://github.com/iwatakeshi/gengojs-core/blob/master/index.js) compared to the current version **0.3.64**.
* Gengo is now a **modulartastic/pluggable** system.
* It's just **awesome**.

**What does this accomplish...**

* The core can support **any** framework!
    * For now I have created wrappers for **Express**, **Koa**, and **Hapi**.
* It's **easier** to contribute because the core is only **~260** lines of code.
    * This is _**way**_ less that the current version's **700**+ and [i18n-node](https://github.com/mashpie/i18n-node/blob/master/i18n.js)'s **700**+ lines of code.
* This will allow you to not worry about **fixed** properties.
    * Basically, **if you don't like it, change it.** :)

**Really!? Tell me more! _Meow!_**

* The core is already available on [npm](https://www.npmjs.com/package/gengojs-core) and [GitHub](https://github.com/iwatakeshi/gengojs-core).  
    * The current status is in **beta** and **should not** be used yet because I haven't fully tested it.
    * You can read more about the core on its page.
* Because the core is a **pluggable** system, you will now be able to **create plugins**. Of course, I will add default plugins but I will allow you to **replace** them easily.
    * The way you create plugins is **pretty similar** to the way you create plugins with **Hapi**.

So that's about it node friends! Have a good one and happy coding! - Takeshi



###Recent Changes

*For previous notes on changes, see CHANGELOG.md*

**0.3.64**

* Updated readme
* Updated packages

**0.3.63**

* Updated readme
* Updated packages

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
