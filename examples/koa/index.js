var koa = require('koa'),
  app = koa(),
  gengo = require('../../koa/');
var path = require('path');
var jade = require('koa-jade-render');
var root = require('app-root-path');
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

app.use(jade(path.normalize(__dirname + '/')));

app.use(function*() {
  'use strict';
  yield this.render('index', {
    title: 'My home page'
  });
});

app.listen(3000);