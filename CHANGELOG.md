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
* Cleaned up code and added comments to help others see how gengo works.
* The npm repo is now combined with the master. Less work for me when updating the readme.
* Moved `LANG` and `LOCALES` to a folder called maps. This will allow to expand the locales and languages without bloating gengo.

**0.2.11**
* Fixed an issue when `localePath` is undefined/has not been set

**0.2.12**
* Fixed an issue where the exposed language and locale were not returning a value.

**0.2.13**
* Bug fixes with XML, routing.
* Added some enhancements to error handling when a variable is not defined.

**0.2.14**
* Small fix for COOKIELOCALE.
* Fixed issues with JSHint/JSLint.
* Added basic tests.

**0.2.15**
* Confirmed that embedded html works in gengo with jade and added an example to sample project.
Specifically it looks like so:

```jade
//index.jade
//notice the !=
p!= __("<a href='https://google.com'>%s</a> にアクセスしてください。")
//output:
//'Visit Google.' with Google being a link.
```

**0.2.16**
* Updated Sample project's npm packages to their latest.
* Fixed a small issue with checking if object is an array for sprintf.

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

**0.3.27**

* Fixed bug when a browser with requesting a foreign locale would not change the site.

**0.3.28**

* Removed removed the global moment and numeral since it's now part of gengo.
* Updated readme
* Updated gengojs.com for v0.3.

**0.3.29**

* Fixed bug in phrase parser when router is enabled. The parser will get the translated version when its suppose to return the original phrase.
* Updated readme

**0.3.30**

* Removed accept-language npm module from the dependants
* Fixed isssue if result in phrase parser is undefined to just return the phrase.
* All tests still pass
* Discovered that gengo works in Sails.js smoothly in a test app (still testing). It will look like this in config/http.js:

```js
/**
 * HTTP Server Settings
 * (sails.config.http)
 *
 * Configuration for the underlying HTTP server in Sails.
 * Only applies to HTTP requests (not WebSockets)
 *
 * For more information on configuration, check out:
 * http://sailsjs.org/#/documentation/reference/sails.config/sails.config.http.html
 */
require('gengojs').config({
  default: 'en-US',
  directory: require('app-root-path') + "/config/locales/",
  debug:{
    level: ['warn', 'debug']
  }
});
module.exports.http = {

  /****************************************************************************
  *                                                                           *
  * Express middleware to use for every Sails request. To add custom          *
  * middleware to the mix, add a function to the middleware config object and *
  * add its key to the "order" array. The $custom key is reserved for         *
  * backwards-compatibility with Sails v0.9.x apps that use the               *
  * `customMiddleware` config option.                                         *
  *                                                                           *
  ****************************************************************************/

   middleware: {

  /***************************************************************************
  *                                                                          *
  * The order in which middleware should be run for HTTP request. (the Sails *
  * router is invoked by the "router" middleware below.)                     *
  *                                                                          *
  ***************************************************************************/
    __: require('gengojs').init,

    order: [
      'startRequestTimer',
      'cookieParser',
      'session',
      'myRequestLogger',
      'bodyParser',
      'handleBodyParserError',
      "__",
      'compress',
      'methodOverride',
      'poweredBy',
      '$custom',
      'router',
      'www',
      'favicon',
      '404',
      '500'
    ],

  /****************************************************************************
  *                                                                           *
  * Example custom middleware; logs each request to the console.              *
  *                                                                           *
  ****************************************************************************/

    // myRequestLogger: function (req, res, next) {
    //     console.log("Requested :: ", req.method, req.url);
    //     return next();
    // }


  /***************************************************************************
  *                                                                          *
  * The body parser that will handle incoming multipart HTTP requests. By    *
  * default as of v0.10, Sails uses                                          *
  * [skipper](http://github.com/balderdashy/skipper). See                    *
  * http://www.senchalabs.org/connect/multipart.html for other options.      *
  *                                                                          *
  ***************************************************************************/

    // bodyParser: require('skipper')

   },

  /***************************************************************************
  *                                                                          *
  * The number of seconds to cache flat files on disk being served by        *
  * Express static middleware (by default, these files are in `.tmp/public`) *
  *                                                                          *
  * The HTTP static cache is only active in a 'production' environment,      *
  * since that's the only time Express will cache flat-files.                *
  *                                                                          *
  ***************************************************************************/

  // cache: 31557600000
};


```

**0.3.31**

* Added support for traditional JSON. Change the extension in config with: `extension: 'json'`
* Added support for arrays in JSON format if you want to use multiline. Specifically, you don't need to add `.join('\n')` to the array.
* Updated gengo.js site to reflect changes and also added more examples.
* Added more tests. Total of 156 tests and passing.
* The way how path works has changed!! The default is the same but if you specify a certain location other than the default, gengo will automatically append the root folder. Therefore, you no longer need to do something like "../../somewhere". It would automatically point from the root. Example: 'root + your/folder/'

**0.3.32**

* Updated readme
* Changed locale function to `getLocale()` and `setLocale()`.
  * They are now exposed to `req` and also work the same way in [mashpie](https://github.com/mashpie/i18n-node)'s i18n library.
  * Added more tests. 164 tests and passing

**0.3.33**

* Updated readme
* Updated site.

**0.3.34**

* Updated readme
* Fixed server crashing if the default locale's dictionary does not exist. gengo will now try to return the phrase or it will return undefined depending on the type of input.
* Added starter sails js apps with different templates.
    * jade (with router: true) ✔
    * handlebars ✔
    * ejs ✔
* Added a few more known locales: fr, es, de, de-AT. Please fork away to add more locales to `locales.js`! Note that I am adding locales but it would take some time. Sharing is caring and it can be fun so please contribute to this amazing library!

**0.3.35**

* Changed `cookiename` to `cookie`. Just simpler if you're coming from i18n.

**0.3.36**

* Changed how you enable debugging. You no longer need to pass a `level`object. Just pass an array `['warn', 'debug',...]
* gengo no longer cares whether you set your locale in uppercase or lowercase it will always return the locale as xx-XX or xx-XXX. Your filename should also be in that format.
* Added a huge list of supported locales. While it may seem dumb at first to have a file of locales, but actually gengo uses it to see if if a string is a locale or not so please add more locales if your locale is not supported yet.
* Added little support for Github markdown style. Specifically, italics, bold and strike.
* All tests still pass.
* Legacies will now have their own package.json so install the node modules at their located folder.
* Updated readme.

**0.3.37**

* Fixed markdown issues for bold and italics. Improved markdown for code and strike.
* Cleaned up some code in parse module.

**0.3.38**

* Added more custom markdown syntax. You can easily add twitter and site attributes links by simply using:

```markdown
[username or text](@username) --> https://www.twitter.com/username
[text](#name-of-attribute) --> href='#name-of-attribute'

```

**0.3.39**

* Fixed a bug if a requested locale is en then it should have fell back to en-US but it didn't.
* Sanitized more locales to make it easier to compare locales.
* Improved the way isDefault handles comparison with the default.

**0.3.40**

* Added travis ci, dependency badge, and travis badge and other badges.
* Fixed langs.js map file. Added tests for `language()`, `getLocale()`, `setLocale()`

**0.3.41**

* Added more custom markdown syntax such as superscript.
* Removed a few markdown syntaxes that may become a conflict with mustache syntax.
* Replaced comparison method in loader module. It should compare json objects. If the objects are different then update the cache.

**0.3.42**

* Apologies. Removed comparison method and replaced with underscore's after I realized underscore had their own.
* Also auto-cache* feature now works for both .json and .js files. Meaning you can update your dictionary live in production and development. Gengo updates the cache only if the files have been updated.

**0.3.43**

* Updated English docs for gengojs-site.
* Added keyword to package.json

**0.3.44**

* Improved config module for gengo
* Replaced underscore with lodash.
* Removed utils module and replaced with regex.js.
* Replaced sails app. I will add more templates later.

**0.3.45**

* Added sails app with jade.
  * gengo now has two sails apps that runs perfectly. One with EJS and the other with Jade. (Tried creating hbs app but sails seem to fail? I must have done something wrong. But it should work with most templating engines.)
* Updated readme

**0.3.46**

* Fixed readme

**0.3.47**

* Updated dependencies

**0.3.48**

* Fixed and updated readme (missing changes from last publish)
* Added an override option for directory's path. You can now pass an object with a `path` key which gengo will not append a root to the given path. This is useful in cases where for some reason the root points to a /bin folder (something that happened to me in Windows).

```
//example
  gengo.config({
    directory: {
    path: __dirname + '/locales'
  }
  });
```

**0.3.49**

* Fixed missing root for directory. Apologies if 3.48 affected you.
* All paths are normalized. This will allow node to change the paths from `/` to `\\` on windows. Essentially making gengo cross platform.

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
