Gengo.js
========
[![NPM](https://nodei.co/npm/gengojs.png?downloads=true&downloadRank=true&stars=true)](https://nodei.co/npm/gengojs/)

Visit [Gengojs.com](http://www.gengojs.com) for installation, configuration, and documentation.
Also, feel free to fork gengo and the site to add more languages and locale support!

To fork gengo visit http://www.github.com/iwatakeshi/gengojs

To fork the site visit http://www.github.com/iwatakeshi/gengojs-site

If you would like to see more examples other than the ones on gengojs.com then check out the tests there's 127+ possible ways to gengo!

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

###Notes

* Cache - gengo does cache if and only if the loaded objects are the same. If a change occurs, it will update the cached object. Tested with .json files.


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
* [underscore.js](https://github.com/jashkenas/underscore)
* [sprintf.js](https://github.com/alexei/sprintf.js)
* [xml2js](https://github.com/Leonidas-from-XIV/node-xml2js)

#Change Log


*For previous notes on changes, see CHANGELOG.md*

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
* Added more tests. Total of 164 tests and passing.
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
* Changed how init works but it shouldn't affect anyone.

**0.3.35**

* Changed `cookiename` to `cookie`. Just simpler if you're coming from i18n.