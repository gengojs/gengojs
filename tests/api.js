/*jslint node: true*/
/*global describe, before, it, after*/
var express = require('express'),
  cookieParser = require('cookie-parser'),
  gengo = new require('../gengo.js'),
  request = require('supertest'),
  approot = require('app-root-path'),
  assert = require('assert'),
  app = express(),
  server;

describe('Begin API test', function() {
  before(function(done) {
    gengo.config({
      default: 'en-US',
      supported: ['ja', 'en-US'],
      directory: {path: __dirname + 'locales/'},
      debug: ['error', 'warn']
    });
    app.use(gengo.init);
    app.get('/', function(req, res) {
      res.status(200).send({
        language: gengo.language()
      });
    });
    server = app.listen(3000);
    done();
  });

  describe('getLocale', function() {
    it('Should return locale: \'ja\' with getLocale()', function(done) {
      request(app)
        .get('/')
        .set('Accept-Language', 'ja')
        .expect(200)
        .end(function(error, res) {
          if (error) {
            throw error;
          }
          assert.equal(gengo.getLocale(), "ja");
          done();
        });
    });

    it('Should return locale: \'ja\' with getLocale(res)', function(done) {
      request(app)
        .get('/')
        .set('Accept-Language', 'ja')
        .expect(200)
        .end(function(error, res) {
          if (error) {
            throw error;
          }
          assert.equal(gengo.getLocale(res), "ja");
          done();
        });
    });

    it('Should return locale: \'en-US\' with getLocale()', function(done) {
      request(app)
        .get('/')
        .set('Accept-Language', 'en_US')
        .expect(200)
        .end(function(error, res) {
          if (error) {
            throw error;
          }
          assert.equal(gengo.getLocale(), "en-US");
          done();
        });
    });

    it('Should return locale: \'en-US\' with getLocale(res)', function(done) {
      request(app)
        .get('/')
        .set('Accept-Language', 'en_US')
        .expect(200)
        .end(function(error, res) {
          if (error) {
            throw error;
          }
          assert.equal(gengo.getLocale(res), "en-US");
          done();
        });
    });
  });


  describe('setLocale', function() {
    it('Should return locale: \'en-US\' with setLocale(\'en-US\') and Accept-Language \'ja\'', function(done) {
      request(app)
        .get('/')
        .set('Accept-Language', 'ja')
        .expect(200)
        .end(function(error, res) {
          if (error) {
            throw error;
          }
          gengo.setLocale('en-US');
          assert.equal(gengo.getLocale(), "en-US");
          done();
        });
    });

    it('Should return locale: \'en-US\' with setLocale(\'en-US\') and Accept-Language \'ja\'', function(done) {
      request(app)
        .get('/')
        .set('Accept-Language', 'ja')
        .expect(200)
        .end(function(error, res) {
          if (error) {
            throw error;
          }
          gengo.setLocale('en-US');
          assert.equal(gengo.getLocale(), "en-US");
          done();
        });
    });

    it('Should return locale: \'ja\' with setLocale(\'ja\') and Accept-Language \'en-US\'', function(done) {
      request(app)
        .get('/')
        .set('Accept-Language', 'en-US')
        .expect(200)
        .end(function(error, res) {
          if (error) {
            throw error;
          }
          gengo.setLocale('ja');
          assert.equal(gengo.getLocale(), "ja");
          done();
        });
    });

    it('Should return locale: \'ja\' with setLocale(\'ja\') and Accept-Language \'en-US\'', function(done) {
      request(app)
        .get('/')
        .set('Accept-Language', 'en-US')
        .expect(200)
        .end(function(error, res) {
          if (error) {
            throw error;
          }
          gengo.setLocale('ja');
          assert.equal(gengo.getLocale(), "ja");
          done();
        });
    });
  });

  after(function(done) {
    server.close();
    done();
  });
});
