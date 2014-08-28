gengojs
=======

An uber basic and simple i18n library for Express 4

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
    default: 'en' 
    supported: ['ja','en']
});
//init before your routes. if using express generator it would be right after the last 'app.use'
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
I'll need testers to try it in other templates.
```jade
extends layout

block content
  h1= title
  //pretty much the same as i18n '__', maybe if many requests then that can be changed.
  p Welcome to #{__("Welcome to express")}
```
##API

###Config
#####localePath (String)
This is the path to the locale files. Default is [the app's root]/locales.
#####debug (bool)
Allows you to see the nitty gritty stuff. Default is false.
#####supported (Array of Strings)
The supported locales in your app. Default is ['en_US', 'en'].
#####default (String)
The default language used in your html, jade, etc. This means you can use a native language and translate it to 'en'. Default is 'en_US'.
#####viewAware (bool)
View Aware allows you to organize your translation files into paths/routes. See example above. Note: In theory the template shouldn't matter. Default is false.
#####views (JSON like Object)
Allows you to set your view's path and the name of your view to that path(or the route set in the translation file). ie. the default is:
```js
{
    "/": 'index' 
}

```
##About
I've tried i18n and i18n-2, but neither seem to show an example for Express 4 that works
out right out the box with a simple syntax to access the files with translations using Jade. So I
decided to create one that will work my projects.

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

##TODO
Currently, gengo can't translate for those who are using a 'en_US' set browser but want a 'ja' translation in that browser (I think ha!).
I could have another setting that can be set from the browser to where it looks like so: 
```jade
    //in index.jade
    script __.setLocale = 'ja'
```
If I can update the webpage in realtime that would be great, otherwise I'll need to refresh the page.