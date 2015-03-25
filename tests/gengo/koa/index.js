var root = require('app-root-path');
var path = require('path');
var gengo = require(path.normalize(root + '/koa/'));
var assert = require('chai').assert;
var package = require(root + '/package');
gengo({
  supported: ['en-us', 'ja'],
  directory: root + '/tests/locales/routed/dest',
});

describe('module', function () {
  it('should export a valid version', function () {
    assert.strictEqual(gengo.version, package.version);
  });

  it('should export gengo', function () {
      assert.isFunction(gengo);
  });

  it('should export clone', function () {
    assert.isFunction(gengo.clone);
  });

  it('should export __ from clone', function () {
    assert.isFunction(gengo.clone().__);
  });

  it('should export __l from clone', function () {
    assert.isFunction(gengo.clone().__l);
  });

  it('should export locale from clone', function () {
    assert.isFunction(gengo.clone().__.locale);
  });
  
  it('should export language from clone', function () {
    assert.isFunction(gengo.clone().__.language);
  });

  it('should export languages from clone', function () {
    assert.isFunction(gengo.clone().__.languages);
  });
});