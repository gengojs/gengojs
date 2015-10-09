gengo.js  
========

[![Join the chat at https://gitter.im/gengojs/gengojs](https://badges.gitter.im/Join%20Chat.svg)](https://gitter.im/gengojs/gengojs?utm_source=badge&utm_medium=badge&utm_campaign=pr-badge&utm_content=badge)

[![Build Status](https://travis-ci.org/gengojs/gengojs.svg?branch=master)](https://travis-ci.org/gengojs/gengojs)
[![Dependency Status](https://david-dm.org/gengojs/gengojs.svg)](https://github.com/gengojs/gengojs/blob/master/package.json)
[![License Status](http://img.shields.io/npm/l/gengojs.svg)](https://github.com/gengojs/gengojs/blob/master/LICENSE) 
[![Downloads](http://img.shields.io/npm/dm/gengojs.svg)]() 
[![Version](http://img.shields.io/npm/v/gengojs.svg)]()


## News

Hey! Sorry for any delays! gengo.js has been through some transitions and hopefully it will lead it to becoming a better library but here's what happened:
* gengo.js has moved into [a dedicated GitHub account](https://github.com/gengojs)
* All official plugins have been updated and can be found at the dedicated account.
* All plugins and the core have been documented.

In the coming weeks I will be working on a revamped version of the website/documentation with the updated gengo.js. In the meantime,
please don't hesitate to create issues and/or contribute to this awesome open source project. And to let everyone know, **I am looking for maintainers**. This project isn't very big and shouldn't be difficult to understand on how it works, so if you are interested, feel free to DM me through Gitter or Twitter ([@iwatakeshi](https://twitter.com/iwatakeshi)). :)

~~It's here! It's finally here! Welcome to version 1.0.0-alpha. As the version implies, this version of gengo is not production ready. It's published so that I can get some feedback and of course test it myself. In fact, I already have a couple of thoughts about bringing the core and the plugins into the same repo because individually maintaining them myself is a difficult task. In the meantime, feel free to try it out and report any bugs or suggestions. As far as docs are concerned, it may take a while for me to write as I try to organize everything up and make gengo.js simple enough to extend and make it the best i18n module for Node.~~

## Introduction

**gengo.js** is an i18n/l10n library that is powered by it's very small [core](https://github.com/gengojs/core). Along with the core, it is also managed by six [plugins](https://github.com/gengojs?utf8=%E2%9C%93&query=plugin). The combinations of the these create a powerful and a unique library that enables developers to take over the core and extend its capabilities. The core is essentialy an empty shell that provides the basics such as a way of accessing a plugin's options or the plugin itself. As a starter, begin hacking the core and the plugins to find out how you can develop your own plugins and create the ultimate combination to create the best i18n library for Node.js.

## Sails.js

gengo.js supports Sails **through the use of hooks**. Check out the repo of [sails-hook-gengojs](https://github.com/gengojs/sails-hook-gengojs) for documentation. 

For an example use of the hook, run `npm i && sails lift` under `examples/sails/app/`.

## Usage

```javascript
// Modules used in example
var path = require('path');

// Options used in example
var options = {
  parser: {
    type: '*'
  },
  backend: {
    directory: path.join(__dirname, '/config/locales/')
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

## Options

These are the complete options for the official plugins. Loading options is quite simple in gengo.js.

```json
{
  "api" : {
    "global": "__",
    "localize": "__l"
  },
  "backend": {
    "directory": "./locales",
    "extension": "json",
    "prefix": "",
    "cache": true
  },
  "header": {
    "detect": {
      "query": false,
      "subdomain": false,
      "url": false,
      "cookie": false,
      "header": true
    },
    "keys": {
      "cookie": "locale",
      "query": "locale"
    },
    "supported": ["en-US"],
    "default": "en-US"
  },
  "parser": {
    "type": "default",
    "markdown": {
     "enabled": false,
      "html": false,
      "xhtmlOut": false,
      "breaks": false,
      "langPrefix": "language-",
      "linkify": false,
      "typographer": false,
      "quotes": "“”‘’"
    },
    "template": {
      "enabled": true,
      "open": "{{",
      "close": "}}"
    },
    "sprintf": { "enabled": true },
    "keywords": {
      "default": "default",
      "translated": "translated",
      "global": "global"
    }
  },
  "router": { "enabled": false } 
}
```

There are three file extensions supported:
* JSON
* YAML
* JS

Each plugin have their own defaults (if applicable) but to override them simply use one of the following ways:

* Use a path to the options:

```javascript
gengo('path to options');
```
* Directly override the options:

```javascript
gengo({
  "parser": {/* ... */}
});
```

## Test

```bash
# make sure to install the node modules
npm install

# run test
gulp test
```
