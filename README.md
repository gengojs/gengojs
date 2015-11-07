gengo.js  
========

[![Join the chat at https://gitter.im/gengojs/gengojs](https://badges.gitter.im/Join%20Chat.svg)](https://gitter.im/gengojs/gengojs?utm_source=badge&utm_medium=badge&utm_campaign=pr-badge&utm_content=badge)

[![Build Status](https://travis-ci.org/gengojs/gengojs.svg?branch=master)](https://travis-ci.org/gengojs/gengojs)
[![Dependency Status](https://david-dm.org/gengojs/gengojs.svg)](https://github.com/gengojs/gengojs/blob/master/package.json)
[![License Status](http://img.shields.io/npm/l/gengojs.svg)](https://github.com/gengojs/gengojs/blob/master/LICENSE) 
[![Downloads](http://img.shields.io/npm/dm/gengojs.svg)](https://www.npmjs.com/package/gengojs) 
[![Version](http://img.shields.io/npm/v/gengojs.svg)](https://www.npmjs.com/package/gengojs)


## Progress:

- [x] Updated to Koa v2.0.0-alpha.3
- [x] Dropped support for Node.js < 4.0 
  (Sorry, but most servers are moving beyond 4. In theory, gengojs should still work below 4.0)
- [ ] Writing docs.


### *Help wanted*:

 **I am looking for maintainers**! This project isn't very big and shouldn't be difficult to understand on how it works, so if you are interested, feel free to DM me through Gitter or Twitter ([@iwatakeshi](https://twitter.com/iwatakeshi)). :)

## Introduction

**gengo.js** is a server agnostic i18n/l10n library that is powered by its very small [core](https://github.com/gengojs/core). Along with the core, it is also managed by six [plugins](https://github.com/gengojs?utf8=%E2%9C%93&query=plugin). The combinations of the these create a powerful and a unique library that enables developers to take over the core and extend its capabilities. The core is essentialy an empty shell that provides the basics such as a way of accessing a plugin's options or the plugin itself. As a starter, begin hacking the core and the plugins to find out how you can develop your own plugins and create the ultimate combination to create the best i18n library for Node.js.

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
var app = new require('koa')();
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

These are the complete and default options for the official plugins. Assigning options is quite simple in gengo.js.

```toml
# Options For Default Plugins
# ===========================

# API Options
# See https://github.com/gengojs/plugin-api for documentation.
[api]
  # 'global' refers to the api use for i18n your phrases. 
  #          ( e.g. __("Hello") )
  global = "__"
  # 'localize' refers to the api use for i18n your date, time, and number. 
  #            ( e.g. __l("ja").date().now() )
  localize = "__l"

# Backend Options
# See https://github.com/gengojs/plugin-backend for documentation.
[backend]
  # 'cache' refers to caching and enables gengo to store the dictionary 
  #         without changes until the server has been restarted.
  cache = true
  # 'directory' refers to the path to your dictionary
  directory = "./locales"
  # 'extension' refers to the file extension of your dictionary.
  extension = "json"
  # 'prefix' refers to the prefix in your file's name.
  prefix = ""
  
# Header Options
# See https://github.com/gengojs/plugin-header for documentation.
[header]
  # 'default' refers to the default locale of your app.
  default = "en-US"
  # 'supported' refers to the locales supported in your app.
  supported = ["en-US"]
  # 'headder.detect' refers to the detection type. 
  #                  Notes: 
  #                   * It is best to use one type of detection.
  #                   * Any PRs will be accepted that may help 
  #                     gengojs-accept detect multiple types.
  [header.detect]
    # 'cookie' enables cookie parsing for the locale.
    cookie = false
    # 'header' enables header parsing for the locale.
    #          ( e.g. Accept-Language )
    header = true
    # 'query' enables query parsing for any key that refers to the locale.
    #         ( e.g. http://example.com/hello?locale=ja )
    query = false
    # 'subdomain' enables subdomain parsing for the locale.
    #             ( e.g. http://ja.example.com )
    subdomain = false
    # url' enables url parsing for the locale.
    #      ( e.g. http://www.example.com/ja )
    url = false
# 'header.keys' refers to the key used in cookie and query parsing.
[header.keys]
  cookie = "locale"
  query = "locale"
  
# Parser Options
# See https://github.com/gengojs/plugin-parser for documentation.
[parser]
  # 'type' refers to the type of parser used.
  #        ( e.g. 'default' = template/interpolation and sprintf, 'format' = message format, '*' = all/auto )
  type = "default"
  # 'keywords' refers to the keywords used in your dictionary.
  [parser.keywords]
    # 'default' refers to the default phrase 
    #           in your dictionary (in your native language).
    default = "default"
    # 'global' refers to the globally used dictionary 
    #          when router is enabled (router independent).
    global = "global"
    # 'translated' refers to the translated phrase 
    #              in your dictionary (in another language).
    translated = "translated"
  # 'parser.markdown' refers to options for markdown-it.
  #                   See https://github.com/markdown-it/markdown-it for documentation.
  [parser.markdown]
    breaks = false
    enabled = false
    html = false
    langPrefix = "language-"
    linkify = false
    quotes = "“”‘’"
    typographer = false
    xhtmlOut = false
  # 'parser.sprintf' refers to sprintf
  [parser.sprintf]
    # 'enabled' refers to enabling sprintf.
    enabled = true
  # 'parser.template' refers to interpolation.
  #                   ( e.g. __('{{greet}}', 'hello') -> 'hello'
  [parser.template]
    # 'enabled' refers to enabling interpolation.
    enabled = true
    # 'open' refers to opening expression.
    open = "{{"
    # 'close' refers to opening expression.
    close = "}}"

# Router Options
# See https://github.com/gengojs/plugin-router for documentation.
[router]
  # 'enabled' refers to enabling the special data structure in your dictionary.
  #           ( e.g. URL path = '/greet/', Dictionary = { 'index': {'greet': { /* ... */ } } } )
  enabled = false
```

There are three file extensions supported:
* JSON
* YAML
* TOML
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
