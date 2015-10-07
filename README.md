gengo.js  
========

[![Build Status](https://travis-ci.org/gengojs/gengojs.svg?branch=master)](https://travis-ci.org/gengojs/gengojs)
[![Dependency Status](https://david-dm.org/gengojs/gengojs.svg)](https://github.com/gengojs/gengojs/blob/master/package.json)
[![License Status](http://img.shields.io/npm/l/gengojs.svg)](https://github.com/gengojs/gengojs/blob/master/LICENSE) 
[![Downloads](http://img.shields.io/npm/dm/gengojs.svg)]() 
[![Version](http://img.shields.io/npm/v/gengojs.svg)]()

## News


~~It's here! It's finally here! Welcome to version 1.0.0-alpha. As the version implies, this version of gengo is not production ready. It's published so that I can get some feedback and of course test it myself. In fact, I already have a couple of thoughts about bringing the core and the plugins into the same repo because individually maintaining them myself is a difficult task. In the meantime, feel free to try it out and report any bugs or suggestions. As far as docs are concerned, it may take a while for me to write as I try to organize everything up and make gengo.js simple enough to extend and make it the best i18n module for Node.~~

## Usage

```javascript
// Modules used in example
var path = require('path');
var root = require('app-root-path');

// Options used in example
var options = {
  parser: {
    type: '*'
  },
  backend: {
    directory: path.join(root.path, '/config/locales/')
  },
  header: {
    supported: ['en-US', 'ja']
  }
};

// Express
var gengo = require('gengojs');
var app = require('express')();
// Use gengo
app.use(gengo(options));

// Koa
var gengo = require('gengojs/koa');
var app = require('koa')();
// Use gengo
app.use(gengo(options));

// Hapi
var server = new require('hapi').Server();
var gengo = require('../../hapi/');
// Register gengo
server.register(gengo(options), function(error) {
  if (error) console.log('an error occurred: ' + error);
});

```

## Test

```bash
# make sure to install the node modules
npm install

# run test
grunt
```