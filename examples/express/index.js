var express = require('express'),
  app = express(),
  gengo = require('../../express/');
var path = require('path');

app.set('view engine', 'jade');
app.set('views', path.normalize(__dirname + '/'));


app.use(gengo({
  backend: {
    directory: './tests/locales',
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