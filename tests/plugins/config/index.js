var assert = require('chai').assert;
var path = require('path');
var root = require('app-root-path');
var norm = path.normalize;
var config = require(norm(root + '/plugins/config/'))().clone();
var settingsPath = norm(root + '/settings/');
var configuredPath = norm(root + '/tests/settings/');

describe('config', function() {
  describe('read', function() {
    it('should load the default settings', function(done) {
      assert.deepEqual(new config().configuration(), require(settingsPath));
      done();
    });
    it('should load configured json settings', function(done) {
      var settings = new config(configuredPath + 'index.json');
      assert.notDeepEqual(settings.configuration(), require(settingsPath));
      assert.deepEqual(settings.supported(), ['en-us', 'ja']);
      assert.deepEqual(settings.extension(), '.yml');
      done();
    });
    it('should load configured yaml settings', function(done) {
      var settings = new config(configuredPath + 'index.yml');
      assert.notDeepEqual(settings.configuration(), require(settingsPath));
      assert.deepEqual(settings.supported(), ['en-us', 'ja']);
      assert.deepEqual(settings.extension(), '.yml');
      done();
    });
  });
  describe('default', function() {
    describe('identifier', function() {
      describe('i18n', function() {
        it('should === "__"', function(done) {
          assert.strictEqual(new config().globalID(), "__");
          done();
        });
      });
      describe('l10n', function() {
        it('should === "__l"', function(done) {
          assert.strictEqual(new config().localizeID(), "__l");
          done();
        });
      });
    });
    describe('directory', function() {
      it('should === "' + path.normalize(root + '/locales/') + '" ', function(done) {
        assert.strictEqual(new config().directory(), path.normalize(root + '/locales/'));
        done();
      });
    });
    describe('supported', function() {
      it('should === ["en-us"]', function(done) {
        assert.deepEqual(new config().supported(), ['en-us']);
        done();
      });
    });
    describe('default', function() {
      it('should === "en-us"', function(done) {
        assert.strictEqual(new config().default(), 'en-us');
        done();
      });
    });
    describe('router', function() {
      it('should === false', function(done) {
        assert.strictEqual(new config().isRouter(), false);
        done();
      });
    });
    describe('markdown', function() {
      it('should === false', function(done) {
        assert.strictEqual(new config().isMarkdown(), false);
        done();
      });
    });
    describe('cache', function() {
      it('should === false', function(done) {
        assert.strictEqual(new config().isCache(), false);
        done();
      });
    });
    describe('extension', function() {
      it('should === "json"', function(done) {
        assert.strictEqual(new config().extension(), '.json');
        done();
      });
    });
    describe('keywords', function() {
      it('should === "{default: "default",translated: "translated",global: "global", plural: "plural"}"', function(done) {
        assert.deepEqual(new config().keywords(), {
          default: 'default',
          translated: 'translated',
          global: 'global',
          plural: 'plural'
        });
        done();
      });
    });
    describe('prefix', function() {
      it('should === ""', function(done) {
        assert.strictEqual(new config().prefix(), "");
        done();
      });

    });
    describe('template', function() {
      it('should === "{{" && "}}"', function(done) {
        var template = new config().template();
        assert.strictEqual(template.open, '{{');
        assert.strictEqual(template.close, '}}');
        done();
      });
    });
    describe('detect', function() {
      it('should === {header:true, cookie:false, subdomain:false, query:false,url:false}', function(done) {
        var detect = new config().detect();
        assert.deepEqual(detect, {
          query: false,
          subdomain: false,
          url: false,
          cookie: false,
          header: true
        });
        done();
      });
    });
    describe('keys', function() {
      it('should === {query:"locale", cookie:"locale"}', function(done) {
        var keys = new config().keys();
        assert.deepEqual(keys, {
          query: 'locale',
          cookie: 'locale'
        });
        done();
      });
    });
  });
  describe('configured', function() {
    describe('identifier', function() {
      describe('i18n', function() {
        it('should === "_g"', function(done) {
          assert.strictEqual(new config({
            global: '_g'
          }).globalID(), "_g");
          done();
        });
      });
      describe('l10n', function() {
        it('should === "_l"', function(done) {
          assert.strictEqual(new config({
            localize: '_l'
          }).localizeID(), "_l");
          done();
        });
      });
    });
    describe('directory', function() {
      it('should === "' + path.normalize(root + 'tests/locales/') + '" ', function(done) {
        assert.strictEqual(new config({
          directory: './xfolder'
        }).directory(), path.normalize(root + '/xfolder/'));
        assert.strictEqual(new config({
          directory: '/xfolder'
        }).directory(), path.normalize(root + '/xfolder/'));
        done();
      });
    });
    describe('supported', function() {
      it('should === ["en-us", "ja", "es"]', function(done) {
        assert.deepEqual(new config({
          supported: ['en-US', 'ja', 'es']
        }).supported(), ['en-us', 'ja', 'es']);
        done();
      });
    });
    describe('default', function() {
      it('should === "ja"', function(done) {
        assert.strictEqual(new config({
          default: 'ja'
        }).default(), 'ja');
        done();
      });
    });
    describe('router', function() {
      it('should === true', function(done) {
        assert.strictEqual(new config({
          router: true
        }).isRouter(), true);
        done();
      });
    });
    describe('markdown', function() {
      it('should === true', function(done) {
        assert.strictEqual(new config({
          markdown: true
        }).isMarkdown(), true);
        done();
      });
    });
    describe('cache', function() {
      it('should === true', function(done) {
        assert.strictEqual(new config({
          cache: true
        }).isCache(), true);
        done();
      });
    });
    describe('extension', function() {
      it('should === "js"', function(done) {
        assert.strictEqual(new config({
          extension: 'js'
        }).extension(), '.js');
        assert.strictEqual(new config({
          extension: '.js'
        }).extension(), '.js');
        assert.strictEqual(new config({
          extension: '.JS'
        }).extension(), '.js');
        done();
      });
    });
    describe('keywords', function() {
      it('should === "{default: "a",translated: "b",global: "c", plural: "e"}"', function(done) {
        assert.deepEqual(new config({
          keywords: {
            default: 'a',
            translated: 'b',
            global: 'c',
            plural: 'e'
          }
        }).keywords(), {
          default: 'a',
          translated: 'b',
          global: 'c',
          plural: 'e'
        });

        assert.deepEqual(new config({
          keywords: {
            translated: 'b',
            global: 'c',
            plural: 'd'
          }
        }).keywords(), {
          default: 'default',
          translated: 'b',
          global: 'c',
          plural: 'd'
        });
        done();
      });
    });
    describe('prefix', function() {
      it('should === "lang"', function(done) {
        assert.strictEqual(new config({
          prefix: "lang"
        }).prefix(), "lang");
        done();
      });
    });
    describe('template', function() {
      it('should === "{{" && "}}"', function(done) {
        var template = new config({
          template: {
            open: '{',
            close: '}'
          }
        }).template();

        assert.strictEqual(template.open, '{');
        assert.strictEqual(template.close, '}');
        done();
      });
    });
    describe('detect', function() {
      it('should === {header:true, cookie:false, subdomain:false, query:false,url:false}', function(done) {
        var detect = new config({
          detect: {
            query: true,
            subdomain: false,
            url: true,
            cookie: false,
            header: true
          }
        }).detect();

        assert.deepEqual(detect, {
          query: true,
          subdomain: false,
          url: true,
          cookie: false,
          header: true
        });
        done();
      });
    });
    describe('keys', function() {
      it('should === {query:"query", cookie:"cookie"}', function(done) {
        var keys = new config({
          keys: {
            query: 'query',
            cookie: 'cookie'
          }
        }).keys();
        assert.deepEqual(keys, {
          query: 'query',
          cookie: 'cookie'
        });
        done();
      });
    });
  });
});