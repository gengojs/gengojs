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
* Updated Japanese docs. (May take a while since I'm working on a project)

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

###Tested environmnents

* Elementary OS (Ubuntu based distro and mainly used for developing gengo)
* Windows 10


###Using gengo in scripts

I am not savy to say whether it is safe or not but it is possible to use gengo in your view.
I am using Jade, but the following should work for other view engines.

```jade
//body ...
script.
    $(document).ready(function(){
        alert("!{__('Hello', 'ja')}"); // --> こんにちは
    });

```

###Sails.js setup

See sails/(ejs or jade)/config/http.js.

gengo must be set in a certain order for '\_\_' to work. I've created a gist so that you can just copy and paste it into yourSailsApp/config/. Therefore there is no need to mess with sail's built in i18n or its locales. This will work on all platforms (linux, mac, windows)

*gist*: https://gist.github.com/iwatakeshi/e6f73cd0f19ce1816c70

###Recent Changes
*For previous notes on changes, see CHANGELOG.md*

**0.3.50**

* Fixed tests for windows.
* Changed gengojs's description.

**0.3.51**

* Updated readme
* Fixed weird log/debug (cout) when loading locales.
* Updated node modules.

**0.3.52**

* Fixed missing "." when debugging successful locale loads.
* Fixed bug in router.
* Updated readme.

**0.3.53**

* Updated readme
* Fixed core debug message

**0.3.54**

* Updated node modules

**0.3.55**

* Added support for file prefix
* Changed gengo's description in package.json
* Added support for plain object options for debugging. This will allow you to add timestamps. see [cout](https://github.com/iwatakekshi/cout)
* Updated node modules for sails apps.

###Notes

* Cache - gengo does cache but will replace the cached object if changes have occurred.

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
* [lodash.js](https://github.com/lodash/lodash)
* [sprintf.js](https://github.com/alexei/sprintf.js)
