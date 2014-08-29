gengojs 
=======
An **uber** basic and **simple** i18n library for Express 4.

##Usage

###npm
```bash
sudo npm install gengojs
```

### In app.js
```js
//require
var gengo = require('gengojs');
//configure gengo (optional)
gengo.config({
    debug: false
    localePath: 'Your locale folder'
    default: 'en_US' 
    supported: ['ja','en_US']
    //see API for more configurations
});
//init before your routes. if using express generator it would be right after the last app.use
gengo.init(app);

```
### In locales folder
```js
//ja.js

//really simple, gengojs will just get what you have
module.exports = {
    "Welcome to express": "エクスプレスへようこそ",    
};

//with viewAware: true
module.exports = {
    index:{
        "Welcome to express": "エクスプレスへようこそ",
    }
}
```

### In Jade
I'll need testers to try it in other templates, but it shouldn't matter.
```jade
extends layout

block content
  h1= title
  //pretty much the same as i18n '__', maybe if many requests then that can be changed.
  p Welcome to #{__("Welcome to express")}
```
Note: It is possible to replace words in your translations. gengo uses [sprintf](https://github.com/alexei/sprintf.js) as its core for
replacements. The only feature that is not supported is [Argument swapping](https://github.com/alexei/sprintf.js#argument-swapping) due to the use of n-arugments. I haven't figured out how to use n-arguments with gengo already using two.

##API

###Config
#####localePath (String)
This is the path to the locale files. Default is [the app's root]/locales.
#####debug (bool)
Allows you to see the nitty gritty stuff. Default is `false`.
#####supported (Array of Strings)
The supported locales in your app. Default is `['en_US', 'en']`.

Note: gengo is strict concerning comparisons. If your default does contain similar languages, ie. `'en_US'` and `'en'`, you must provide both. I personally am not aware of of the differences, but if there are none then just duplicate the file and rename the file.
#####default (String)
The default language used in your html, jade, etc. This means you can use a native language and translate it. Default is `'en_US'`.
#####viewAware (bool)
View Aware allows you to organize your translation files into paths/routes. See example above. Note: In theory the template shouldn't matter. Default is `false`.
#####views (JSON like Object)
Allows you to set your view's path and the name of your view to that path(or the route set in the translation file). ie. the default is:
```js
{
    "/": 'index' 
}

```
##Note
This may not be for you, but it is highly customizable (ie. In theory, it should work with browsers, but that part has not been implemented) so feel free to fork and improve it @ http://github.com/iwatakeshi/gengojs . Also, the sample version is in the 'master' and the npm version is in the 'npm' branch. (The sample isn't using npm version of gengojs, but a local version for the mean time.)

##Tested
* Express
    * I've only tested with Express 4 (using generator) and Jade.
* Languages
    * English
    * Japanese
* Pages
    * index.jade
    
##How to test multiple languages
I'm currently using Opera with a default language set to 'ja'. Also, [postman](https://chrome.google.com/webstore/detail/postman-rest-client/fdmmgilgnpjigdojojpjoooidkmcomcm?hl=en) with the 'Accept-Language' header set to 'ja' works as well.
In theory, gengo will only translate to those that are not native to the default. So ie. lets say the default is 'en', if Chrome has 'en_US' and Opera
has 'ja', only the user using Opera will see the translation and gengo will just return the english words for the Chrome user.

##~~TODO~~
~~Currently, gengo can't translate for those who are using a 'en_US' set browser but want a 'ja' translation in that browser (I think ha!).
I could have another setting that can be set from the browser to where it looks like so:~~
```jade
    //in index.jade
    script __.setLocale = 'ja'
```
~~If I can update the webpage in realtime that would be great, otherwise I'll need to refresh the page.~~
###Update: Changing locale using cookies
You can now change the locale using cookies. The sample app will contain an example but specifically your index page could look like so:
```jade
//In this case, jade will be used.
block content
    h1= __(title)
    p #{__("エクスプレスへようこそ")}
    //some buttons to change the locale
    button(onclick="locale().set('ja');") Japanese
    button(onclick="locale().set('en_US');") English
    button(onclick="locale().reset();") Reset
    script.
        var locale = function(){
            return{
                set: function(locale){
                    //set the cookie
                    document.cookie = "locale=" + locale;
                    //refresh the page
                    location.reload();
                },
                reset: function(){
                    //reset the cookie
                    document.cookie = "locale=";
                    //refresh the page
                    location.reload();
                }
            };
        };
```
The result will be the translated page. If you can think of a better way to change locales without cookies, then feel free to fork away and improve library.

Note: Setting the locale is not manditory and gengo should still be able to translate without it, but if you want users to change languages then this is how it could be done.

For more info on features, check out the wiki. I will be writing on the wiki instead of populating this readme with too much stuff ha!