Gengo.js
========
[![NPM](https://nodei.co/npm/gengojs.png?downloads=true&downloadRank=true&stars=true)](https://nodei.co/npm/gengojs/)

###gengo.js is getting better than ever!
An omega version is under development. The file is called `omega.gengo.js` so it will not affect your current gengo.
See Change Log.

Note on version:

How gengo versioning works is simply:
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
* Revamped gengo.js which is currently under omega status. It's <em>way</em> better:
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

*An alien invasion happened between 0.2.17 and alpha 0.2.20. oh well, we'll proceed from alpha 0.2.20*

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

*The file has been renamed to omega.gengo.js*

**omega 0.2.21**

* Updated readme

* Added mustache as dependency.

**omega 0.2.22**

* Updated readme

**omega 0.2.23**

* Fixed typo for default directory
* Small clean up with JSHint

**omega 0.2.24**

* Replaced dot notation parsing engine, credits to [rhalff](https://github.com/rhalff)
* Replaced markdown engine which fixes a minor bug.
* Removed a few try catch statements that caused issues to the core.
* Updated readme

**omega 0.2.25**

* Router module can now accept urls that contain versions in the following format: `\d{1,2}(\.)\d{1,2}((\.)\d{1,2})?$` Note that adding 'v' before the numbers does not matter just as long its in the form.
* If you want to use multiline line in JSON. Just create the text in the following form and it will work:

```js
//ja.js
module.exports = {
    "index": {
        "something": [
        "line1",
        " line2",
        " line3",
        ].join('\n'),
        "so forth and so on": "something"
    }
};
```
**omega 0.2.26**

* Updated readme
* Fixed a bug in locale engine where cookie could set something that shouldn't be set.
* Fixed a bug in phrase parser where try catch wouldn't let parser return the original phrase if route results didn't exists