Gengo.js
========
[![NPM](https://nodei.co/npm/gengojs.png?downloads=true&downloadRank=true&stars=true)](https://nodei.co/npm/gengojs/)

Visit [Gengojs.com](http://www.gengojs.com) for installation, configuration, and documentation.

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

####gengo 0.3.26 Release

* gengo is now at v0.3! If you want to continue to use v0.2 just change the require path to `gengojs/legacy/v0.2/gengo.js`
* Changed test's gengo path.