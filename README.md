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
    debug: false,
    localePath: 'Your locale folder' //default is 'appRoot/locales'
});
//init before your routes. if using express generator it would be right after the last 'app.use'
gengo.init(app);

```
### In locales folder
```js
//ja.js

//really simple, gengojs will just get what you have
module.exports = {
    Hello: "ハロー",    
};
```
### In Jade
I'll need testers to try it in other templates.
```jade
extends layout

block content
  h1= title
  //pretty much the same as i18n '__', maybe if many requests then that can be changed.
  p Welcome to #{__("Hello")}
```
##About
I've tried i18n and i18n-2, but neither seem to show an example for Express 4 that works
out right out the box with a simple syntax to access the files with translations using Jade. So I
decided to create one that will work my projects.

##Note
This may not be for you, but it is highly customizable (ie. In theory, it should work with browswers, but that part has not been implemented) so feel free to fork and improve it @ http://github.com/iwatakeshi/gengojs . Also the sample version is in the 'master' and the npm version is in the 'npm' branch. (The sample isn't using npm version of gengojs, but a local version for the mean time.)

##Tested
* Express
    * I've only tested with Express 4 (using generator) and Jade.
* Languages
    * English
    * Japanese
* Pages
    * index.html