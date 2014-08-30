##QA

###What is Gengo.js?
gengo is a library that allows you to translate your pages automatically (hot swapping) without having to do tedious stuff...well that is my goal. gengo only requires you to provide the translation files and then your done :).
Also, before moving on, Moment.js and Numeral.js are part of gengo. What does that mean? Well it simply means you get the best of the best in a small package. Technically it means that moment and numeral will change along with gengo (see [Translating](https://github.com/iwatakeshi/gengojs/wiki/Translating) for more details). 

###Where to begin?

gengo is available on npm. To begin:
```bash
sudo npm install gengojs
#or
sudo npm install gengojs --save
```
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
for more configurations options see [API](https://github.com/iwatakeshi/gengojs/wiki/API).

From there you have two options, you can have gengo to:
* load the words/sentences from the translation file directly
* load the words/sentences from the translation file by route (not fully tested)
an example will look like this in your locale folder:
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

Now in your template file (Note: I've only used Jade, others should work)
```jade
extends layout

block content
  h1= title
   //pretty much the same as i18n '__' (can be changed through config. see API)
  //this will output エクスプレスへようこそ or Welcome to express
  p Welcome to #{__("Welcome to express")} 
```
For more templating and translation file examples see [Translating](https://github.com/iwatakeshi/gengojs/wiki/Translating)

###Can I use gengo within routes?
You know what? Yes! Note that it is experimental since I just discovered it. I haven't fully tested it, but it would look like so:
```js
//index.jade, viewAware: false
var express = require('express');
var router = express.Router();
var gengo = require('gengojs');
/* GET home page. */
router.get('/', function(req, res) {
    console.log(gengo('Hello')); //outputs ハロー or Hello
    res.render('index', {
        title: 'Express'
    });
});

module.exports = router;

```
###Can users change the language?
Yes! The only way the user can change language (at the moment) is by using cookies. see [Translating](https://github.com/iwatakeshi/gengojs/wiki/Translating) for an example.

###Can I contribute?
Sure! See [Contribute](https://github.com/iwatakeshi/gengojs/wiki/Contribute) for more details.

##Acknowledgements
gengo was made possible by:
* [locale](https://github.com/jed/locale)
* [App Root Path](https://github.com/inxilpro/node-app-root-path)
* [Moment.js](https://github.com/moment/moment)
* [Numeral.js](https://github.com/adamwdraper/Numeral-js)