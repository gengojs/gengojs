var gengo = require('../express');
var app = require('express')();
var root = require('app-root-path');
/*jshint strict:false*/
app.use(gengo({
  header: {
    supported: ['en-us', 'ja']
  },
  backend: {
    directory: root + '/test/locales/'
  },
  parser: {
    type: '*'
  },
  router: {
    enabled: false
  }
}));

app.use('/', function(req, res) {
  /*res.send(req.__(
    'You have {numPhotos, plural,' +
    ' =0 {no photos.}=1 {one photo.}other {# photos.}}', {
      numPhotos: 1000
    }));*/
  var __ = gengo.clone().__;
  res.send({
    '1': __('[greeting.informal.advanced].hey', 'hello',
      'hello'),
    '2': __('msgformat.photos', {
      numPhotos: 1000
    })
  });
  /*res.send();*/
  /*res.send(req.__(
    'Hello {{name}}', {
      name: 'Takeshi'
    }));*/
});
app.listen(3000);