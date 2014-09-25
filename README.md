Gengo.js
========
[![NPM](https://nodei.co/npm/gengojs.png?downloads=true&downloadRank=true&stars=true)](https://nodei.co/npm/gengojs/)

###gengo.js is getting better than ever!
An alpha version is under development. The file is called `alpha.gengo.js` so it will not affect your current gengo.
See Change Log.

####Change Log at a Glance

Note on version:

How gengo version works is simply:
* Major (When gengo becomes stable after rigid testings and user feedback)
* Minor (Additions and stability improvements)
* Patch (README updates, small fixes/patches)

#####Features at a Glance
* No need for international routes ie '/en' and '/ja'. gengo will translate the page according to the browser's settings, specifically the Accept-Language. Therefore you can use the same route for all languages.
* Ability to change locales through the use of cookies.
* Dictionary based. Meaning that you will provide the keys in your language and then the values into the desired translation.
* JSON and XML support. Mix match is possible. Note that with XML, you can write longer sentences without newlines.
* Ability to change the global varibles to prevent clashing with other libraries.
* Built in Moment.js and Numeral.js (plus you can still use the browser version.)


Supported locales:
* en
* en_US
* ja

Supported languages:
* Japanese
* English
* English US

To add more locales and languages please fork/pr and add your language and locale which are located in the maps folder. This will expand gengo's capability to support other languages. Don't forget to test it!

#####What's new:
* Updated website with two languages:
  * English US
  * Japanese

For more info see Change Logs

#####Coming soon:
* More tests
* Revamped gengo.js which is currently under alpha status. It's <em>way</em> better:
  * Bracket notation support
  * Dot notation support
  * Object support
  * Mustache support
  * see Change Log for more details.

##Help needed!!
First, I want to thank those who downloaded and tried gengo. gengo has a lot of room to grow but is really limited without your help. gengo now has a new site and is available at [gengojs.com](http://www.gengojs.com), but needs your help to improve it
in means of translations and of course gengo itself. So, please visit the Github page and fork away gengo and the site! 

**Also, I am looking for maintainers/collaborators. I don't know all the languages out there and surely, as mentioned earlier, gengo has a lot of room to grow. Please let me now if you are interested in improving gengo and its website.**
You can contact me via twitter [@iwatakeshi](https://twitter.com/iwatakeshi) or [GitHub](https://github.com/iwatakeshi).


###What is Gengo.js?
gengo is a library that allows you to translate your pages automatically (hot swapping) without having to do tedious stuff (such as creating more routes for each language)...well that is my goal. gengo only requires you to provide the translation files and then your done :).
Also, before moving on, Moment.js and Numeral.js are part of gengo. What does that mean? Well it simply means you get the best of the best in a small package. Technically it means that moment and numeral will change along with gengo (see [Translating](https://github.com/iwatakeshi/gengojs/wiki/Translating) for more details). 

###Install

gengo is available on npm. To begin:
```bash
sudo npm install gengojs
#or
sudo npm install gengojs --save
```

###Configure
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


###Dictionaries

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

**0.2.17**

* Updated readme
* gengojs.com has been updated for 0.2.16 but will be re-updated and tested with alpha.
* Working on 0.3.x aka alpha.


####Alpha

*For previous notes on changes, see CHANGELOG.md*

**alpha 0.2.20**

* Added more tests (all 127 passing)
* You can also run individual tests:
    * `npm run functions` - checks the functionality
    * `npm run cookies` - checks if cookies work
    * `npm run libs` - checks if moment and numeral (in progess) works
    * `npm run routes` - checks if routing works
* You can now use a basic locale automator/creator. Just run `npm run factory`.
* Changed locale naming convention from `'en_US'` to `'en-US'` (you may use `'en-US'`, `'en_us'`, or `'en-us'` and gengo will sanitize and return it in the form of `[a-z]-[A-Z]`) Note that you will need to rename your definitions to `'en-US'` etc.
* Bug fix with locale not really doing anything. Changed the locale parsing engine to the same one used in i18n library so credits to [@mashpie](https://github.com/mashpie). But no worries it wasn't as bad as yesterday's 'bash bug' and not as bad as 'heartbleed'.
* Moment.js and Numeral.js are now public.
    * You can also have a global and local version of moment and numeral by simply passing an object like so:

```js
//use the gengo version of moment and numeral
__.moment({locale:'ja'}).format('dddd'); //Will print today in Japanese
__.numeral({locale: 'ja'}, 25).format('$0.00'); //will print in Japanese yen
```
* You can now change the cookie locale name in config. Use `cookiename`. Default is `'locale'`.
* Reduced the number of gengo modules. `core`, `locale`, and `lib` have been moved to `gengo`.
* Fixed bug issue with universe not working properly.
* Better error handling for the most part.

*alpha.gengo.js is now moving to omega phase after this release.*

####Omega

**omega 0.2.21**

* Updated readme
* Added mustache as dependency.

**omega 0.2.22**

* Updated readme

**omega 0.2.23**
* Fixed typo for default directory
* Small clean up with JSHint