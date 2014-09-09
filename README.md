Gengo.js
========
[![NPM](https://nodei.co/npm/gengojs.png?downloads=true&downloadRank=true&stars=true)](https://nodei.co/npm/gengojs/)
####Change Log at a Glance
Current version: **0.2.14**

Note on version:

How gengo version works is simply:
* Major (When gengo becomes stable after rigid testings and user feedback)
* Minor (Additions and stability improvements)
* Patch (README updates, small fixes/patches)

#####What's new:
* Added a few tests. Start the tests with `npm test`.
<br>
For more info Change Logs

#####Coming soon:
* More tests
* Updated gengojs.com (currently working on the Japanese version of the Docs and adding an about page)

##Help needed!!
First, I want to thank those who downloaded and tried gengo. gengo has a lot of room to grow but is really limited without your help. gengo now has a new site and is available at [gengojs.com](http://www.gengojs.com), but needs your help to improve it
in means of translations and of course gengo itself. So, please visit the Github page and fork away gengo and the site!

##QA

###What is Gengo.js?
gengo is a library that allows you to translate your pages automatically (hot swapping) without having to do tedious stuff (such as creating more routes for each language)...well that is my goal. gengo only requires you to provide the translation files and then your done :).
Also, before moving on, Moment.js and Numeral.js are part of gengo. What does that mean? Well it simply means you get the best of the best in a small package. Technically it means that moment and numeral will change along with gengo (see [Translating](https://github.com/iwatakeshi/gengojs/wiki/Translating) for more details). 

###Where to begin?

gengo is available on npm. To begin:
```bash
sudo npm install gengojs
#or
sudo npm install gengojs --save
```
then in your app.js
```js
//require
var gengo = require('gengojs');
//configure gengo (optional)
gengo.config({
    debug: false
    localePath: 'Your locale folder'
    default: 'en_US' 
    supported: ['ja','en_US']
});
//init before your routes. if using express generator it would be right after the last app.use
gengo.init(app);

```
for more configurations options see [Gengo](https://github.com/iwatakeshi/gengojs/wiki/Gengo).

From there you have two options, you can have gengo to:
* load the words/sentences from the translation file directly
* load the words/sentences from the translation file by route (not fully tested)
an example will look like this in your locale folder:

JSON:
```js
//ja.js

//really simple, gengojs will just get what you have
module.exports = {
    "Welcome to express": "エクスプレスへようこそ",    
};

//with viewAware: true and universe: true
module.exports = {
    index:{
        "Welcome to express": "エクスプレスへようこそ",
    }
    //gengo now supports 'universe'. Meaning that the definition will load at every route if routeAware is enabled.
    gengo:{
      "Welcome to express": "エクスプレスへようこそ"
    }
}
```

XML:
```xml
<!--again, really simple-->
<?xml version="1.0" encoding="UTF-8" ?>
<begin>
   <data>
      <key>今日から働きます。</key>
      <value>From today, I will work</value>
   </data>
</begin>

<!--with viewAware: true and universe: true-->
<?xml version="1.0" encoding="UTF-8" ?>
<begin>
    <index>
        <data>
            <key>今日から働きます。</key>
            <value>From today, I will work</value>
        </data>
    </index>
    <gengo>
        <data>
            <key>こんにちは</key>
            <value>Hello</value>
        </data>
    </gengo>
</begin>

```

Now in your template file (Note: I've only used Jade, others should work)
```jade
extends layout

block content
  h1= title
   //pretty much the same as i18n '__' (can be changed through config. see Gengo)
  //this will output エクスプレスへようこそ or Welcome to express
  p Welcome to #{__("Welcome to express")} 
```
For more templating and translation file examples see [Translating](https://github.com/iwatakeshi/gengojs/wiki/Translating)

###Can I use gengo within routes?
You know what? Yes! Note that it is experimental since I just discovered it. I haven't fully tested it, but it would look like so:
```js
//index.jade, viewAware: false
var express = require('express');
var router = express.Router();
var gengo = require('gengojs');
/* GET home page. */
router.get('/', function(req, res) {
    console.log(gengo('Hello')); //outputs ハロー or Hello
    res.render('index', {
        title: 'Express'
    });
});

module.exports = router;

```
###Can users change the language?
Yes! The only way the user can change language (at the moment) is by using cookies. see [Translating](https://github.com/iwatakeshi/gengojs/wiki/Translating) for an example.

###How can I find out which language or locale I'm using?
It's simply:

```js
var gengo = require('gengojs');
//in your views
gengo.language();
gengo.locale();
```

```jade
//in jade
h1 = __.language()
h1 = __.locale()
```
###Can I contribute?
Sure! See [Contribute](https://github.com/iwatakeshi/gengojs/wiki/Contribute) for more details.

##Acknowledgements
gengo was made possible by:
* [locale](https://github.com/jed/locale)
* [App Root Path](https://github.com/inxilpro/node-app-root-path)
* [Moment.js](https://github.com/moment/moment)
* [Numeral.js](https://github.com/adamwdraper/Numeral-js)
* [underscore.js](https://github.com/jashkenas/underscore)
* [sprintf.js](https://github.com/alexei/sprintf.js)
* [xml2js](https://github.com/Leonidas-from-XIV/node-xml2js)

#Change Log
Quite sinful, but starting the log from 0.1.10

**0.1.10**

* Fixed issues with boolean values. Using isDefined should help figuring out whether COOKIELOCALE is set.
* Added new functions to expose the current language and current locale.  (not in the wiki yet)
* Seperated redundant calls to a function when setting current locales and language.
* Made gengo a bit more modular by creating more functions to clean up clutter.
* Added new universe option which allows you to use definitions on all routes. (not in the wiki yet)

**0.2.10**
* Improved stability (Please send bug reports if you encounter an issue).
* Added XML support due to JSON's multi-line limitation. You can now write paragraphs and not have to worry about doing
tedious stuff such as using `\n` in your sentences. Also, XML will be able to run side by side with JSON. Just name your file as
`thelocale.xml` and then create the XML file like so:

```xml
<?xml version="1.0" encoding="UTF-8" ?>
<begin> <!--begin tag-->
    <index><!--if routeAware is enabled then set the name of routes here-->
        <data><!--data tag-->
            <key>今日から働きます。</key> <!--key tag-->
            <value>From today, I will work.</value><!--value tag-->
        </data>
        <data><!--additional -->
            <key>今日から働きます。</key>
            <value>From today, I will work.</value>
        </data>
    </index>
    <data>
      <!--if routeAware is disabled then it would start with the 
      data tag and have just the key and value tags-->
    </data>
    <gengo> <!--universal route for XML would look like this, can be changed through config -->
    </gengo>
</begin>
``` 
easy right? gengo will try to load the XML even if it doesn't exist but it will not crash your server or your template.

* Renamed `viewAware` to `routeAware` in config. So just change in your option, viewAware to routeAware and views to routes. This was
done to prevent any confusion.
* Changed the exposed current language and locale from function to a string variable.
* Cleaned up code and added comments to help others how gengo works.
* The npm repo is now combined with the master. Less work for me when updating the readme.
* Moved `LANG` and `LOCALES` to a folder called maps. This will allow to exand the locales and languages without bloating gengo.

**0.2.11**
* Fixed an issue when `localePath` is undefined/has not been set.

**0.2.12**
* Fixed an issue where the exposed language and locale were not returning a value.

**0.2.13**
* Bug fixes with XML, routing, etc.
* Added some enhancements to error handling when a variable is not defined.

**0.2.14**
* Small fix for COOKIELOCALE.
* Fixed issues with JSHint/JSLint.
* Added basic tests.