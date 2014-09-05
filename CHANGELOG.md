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
* Fixed an issue when `localePath` is undefined/has not been set

**0.2.12**
* Fixed an issue where the exposed language and locale were not returning a value.