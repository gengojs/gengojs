Gengo.js
========
[![NPM](https://nodei.co/npm/gengojs.png?downloads=true&downloadRank=true&stars=true)](https://nodei.co/npm/gengojs/)

###gengo.js is getting better than ever!
An alpha version is under development. The file is called `alpha.gengo.js` so it will not affect your current gengo.
See Change Log.

####Change Log at a Glance
Current version: **0.2.17**

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


######Alpha

**alpha 0.2.17**
* This version will be complete overhaul but to be backward compatible (as much as possible)

**Changes to gengo's design**
* Really modular and easier to maintain.

**Changes to functionality:**
* Bracket notation and Dot notation support. Examples:
    * `[navbar.home]` - means a key contains `navbar.home`.
    * `[navbar.home].plural` - means a key contains `navbar.home` and a subkey contains `plural`.
    * `[%s how are you?].informal` - means a key contains `%s how are you?` and a subkey contains `informal`.
    * `navbar.home` - means a key contains `navbar` and a subkey contains `home`.
* Object support:
    * `__({phrase:'Your phrase here {{someObject}}', locale: 'ja', count: '2'}, {sprintf: ['hello'], someObject:'blah'})`
* Mustache support. You my now include mustache notation, specifically:
    * `__("Hi how are you {{name}}?", {name:"John Doe"})`
* Specific Locale. Change the locale for a specific phrase
    * `__("Your phrase here", "ja")` or `__("Your phrase here", {locale: 'ja'})`
* Basic plural support. (I recommend you to use dot notation but here are the options):
    * `__("Your phrase here %d", 2)` `__("Your phrase here %s", {count: "2"})` and visa-versa.
* Changed Sprintf to [kawari.js](https://www.github.com/iwatakeshi/kawarijs). It's really basic and not as vibrant as Sprintf but passing arrays is easier. Of course you can improve it if you like so fork that project away!
    * Not much change to how you use it. so you can pass:
        * `__("Your phrase here %d", ['array'])`
        * `__("Your phrase here", number)`
        * `__("Your phrase here", string)`
        * `__("Your phrase here", n number of strings and numbers)` but no arrays or objects (unless you are configuring the locale, count, and/or mustache).
* Temporarily disabled XML support. (I'll figure a way to make it generic for gengo to parse through XML. May take some time.)
* Initializing no longer requires `app`. In express just use `app.use(gengo.init)`. My goal is to support other "frameworks".
* You can now use custom markdown syntax for links:
    * `[Google](https://www.google.com)`
    * `[Google](https://www.google.com)[blank]` will open in a new tab. `_blank|_self|_parent|_top|framename` are supported.

**Changes to config:**
* `routeAware` is now `router`.
* `routes` has been removed. Routes and subroutes are automatically chosen if `router` is `true`.
* `universe` has been moved to `keywords` and is enabled if `router` is `true`.
* `keywords` has been added. The following keywords can be changed: 
    * `default` - used when you are using bracket notation or dot notation (in you native dictionary)
    * `translated` - same `default` (in the translated dictionary)
    * `universe` - used for router
    * `plural` - used for plurality
* The global variables has been moved to `global`:

```js
global: {
    //set gengo global variable
    gengo: "__",
    //set moment global variable
    moment: "moment",
    //set numeral global variable
    numeral: "numeral",
}
```
* Debugging is now even better. Debug will take two types: `boolean` or `array`. With `array` you can specify the debugging level:

```js
debug:{
    level: ['info', 'data', 'warn', 'error','debug']
}
```
* Few tests added. More tests to come. Just run `npm start`.

**alpha 0.2.18**
*Updated readme

**alpha 0.2.19**
*Added Sprintf back as dependency for the original gengo.