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


###Alpha

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
    * `default` - used when you are using bracket notation or dot notation (in your native dictionary)
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
* Updated readme

**alpha 0.2.19**
* Added Sprintf back as dependency for the original gengo.

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
* Renamed `alpha.gengo.js` to `omega.gengo.js`
* Updated readme
* Added mustache as dependency.