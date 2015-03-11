gengo.js  
========

[![Build Status](https://travis-ci.org/iwatakeshi/gengojs.svg?branch=master)](https://travis-ci.org/iwatakeshi/gengojs)  [![Dependency Status](https://david-dm.org/iwatakeshi/gengojs.png)](https://github.com/iwatakeshi/gengojs/blob/master/package.json) [![License Status](http://img.shields.io/npm/l/gengojs.svg)](https://github.com/iwatakeshi/gengojs/blob/master/LICENSE) [![Downloads](http://img.shields.io/npm/dm/gengojs.svg)]() [![Version](http://img.shields.io/npm/v/gengojs.svg)]()

[![NPM](https://nodei.co/npm/gengojs.png?downloads=true&downloadRank=true&stars=true)](https://nodei.co/npm/gengojs/)

##News Flash

*3/11/14*

Hello friends of the same planet! I just wanted to give an update on whats happening to gengo.js. So far the growth of downloads is slowly increasing and I thank again for all who use gengo. So because of you, I'm happy to announce the next milestone for gengo.js: **1.0.0** ([Already a work in progress](https://github.com/iwatakeshi/gengojs/tree/1.0.0)).

Why the 1.0.0? Because there will be a couple of breaking changes to the API but I promise you'll agree that it's worth the change. So here are the changes that will make gengo the best i18n library for your app:

 * The removal of `config`
     - Configure with ease when initializing like the example.
     - Configuring without the long inline configuration setup.

```js
//example
//before
gengo.config({/*...*/})
app.use(gengo.init)

// after
app.use(gengo({/*...*/}))

//configuration with ease
app.use(gengo({__dirname + 'path to [name of configuration file].[json | yaml]'}))

```

* The removal of Numeral.js
    - There seems to be a increase popularity of using `Intl` for number format and also the fact that numeral doesn't seem to be active makes things a bit difficult to improve. If you have any suggestions or would like to create your own number formatting library for gengo.js just fork the *1.0.0* repo and create a pull request.
* Improved plurality.
    - gengojs will use `cldr` as it's main source for plurarity. It automatically creates a function with rules needed for the requested locale. So all you need to do is provide the keywords for the plurarity form:
```js
//in your en-US.json dictionary:
{
    "monkey.tree":{
        "default":"There is a monkey."
        "plural":{
            "one" :"There is %d monkey",
            "other":"There are %d monkies."
            //note that other languages may have
            //'few','many', etc
        }
    }
}
```
* Improved parser
    - You'll be happy with this one: I said to myself "Oh God!", because the parser was terrible when I went back to do some maintenance. Instead of having me do all the work and not knowing whether the parser was good for you or not, I decided to change how it works:
        + You are no longer stuck with one parser that you may not like!
            * What this means is gengo.js acts the same way as express where you can use middlewares to "add"* parsers. This also means you can create your own and share them with others in the node community.
            * I will later give details of how to create your own parser.

```js
// I have built two parsers:
// * default parser where you can use vsprintf and 'templating' (like mustache)
// * message format parser where you can use 
// AST techniques for a better usage of plurality: see https://www.npmjs.com/package/messageformat
// note: while it is possible to use multiple parsers, 
// it is best and recommended to use only one parser.
// Also, both parser support plurality

/*Example:*/
var gengo = require('gengojs'),
    msgfmt = require('gengojs/parser/messageformat');
//Static API
//If parser is not specified, it will automatically load default
//else it will load whatever was added initially
gengo.use(msgfmt());
app.use(gengo());
```

* Templating in default parser
    - The default parser now lets you use the type of opening and closing.
    - Support for nested data
```js
//before
__('Hello {{mustache}}',{mustache:'world!'});
//after
__('Hello %{nested.msg}',{nested:{msg:'world!'}})

```

There are few other changes but those are the big ones. There are other plans to add support for koa and hopefullay other frameworks. If time allows, I will update this over time. Anyways, now is the time to give your input over at github. You can also watch the progress of the repo at https://github.com/iwatakeshi/gengojs/tree/1.0.0. Again, happy coding! -Takeshi

###Recent Changes

*For previous notes on changes, see CHANGELOG.md*

**0.3.63**

* Updated readme
* Updated packages

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
