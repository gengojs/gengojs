var express = require('express'),
  app = express(),
  gengo = require('../../express/');
var path = require('path');
var root = require('app-root-path');

app.set('view engine', 'jade');
app.set('views', path.normalize(__dirname + '/'));

app.use(gengo({
  parser: {
    type: '*'
  },
  backend: {
    directory: path.join(root.path, '/tests/locales/unrouted/dest/')
  },
  header: {
    supported: ['en-US', 'ja']
  }
}));

app.get('/', function(req, res, next) {
  'use strict';
  res.render('index', {
    title: 'My home page'
  });
  next();
});

app.listen(3000);