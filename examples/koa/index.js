var Koa = require('koa'),
  app = new Koa(),
  gengo = require('../../koa/').default;
var path = require('path');
var jade = require('koa-jade-render');
app.use(gengo({
  parser: {
    type: '*'
  },
  backend: {
    directory: path.join(path.resolve(), 'examples/locales')
  },
  header: {
    supported: ['en-US', 'ja']
  }
}));

app.use(jade(path.normalize(__dirname + '/')));

app.use(function(self, next) {
  'use strict';
   self.render('index', {
    title: 'My home page'
  });
   return next();
});

app.listen(3000);