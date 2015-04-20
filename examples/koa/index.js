var koa = require('koa'),
  app = koa(),
  gengo = require('../../koa/');
var path = require('path');
var jade = require('koa-jade-render');

app.use(gengo({
  backend: {
    directory: './tests/locales',
  },
  header: {
    supported: ['en-US', 'ja']
  }
}));

app.use(jade(path.normalize(__dirname + '/')));

app.use(function * () {
  'use strict';
  yield this.render('index', {
    title: 'My home page'
  });
});

app.listen(3000);