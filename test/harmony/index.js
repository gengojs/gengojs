/*jshint strict:false*/
/*global describe, it*/

// Dependencies
var assert = require('chai').assert;
var request = require('supertest');
var _ = require('lodash');
// Servers
var Koa = require('koa');
var hapi = require('hapi');
var express = require('express');
// App
var app = {
  koa: new Koa(),
  hapi: new hapi.Server(),
  express: express()
};
// Wrapper
var gengo = {
  express: require('../../express').default,
  hapi: require('../../hapi').default,
  koa: require('../../koa').default
};

// Options
var options = {
  header: {
    supported: ['en-us', 'ja']
  },
  parser: {
    type: '*'
  },
  router: {
    enabled: false
  }
};

describe('gengo', function() {
  'use strict';
  // API tests
  describe('wrapper test', function() {
    // Koa
    describe('koa', function() {
      app.koa.use(gengo.koa(options));
      app.koa.use(function(self, next) {
        self.body = {
          __: !_.isUndefined(self.__) &&
            !_.isUndefined(self.request.__) &&
            !_.isUndefined(self.req.__),
          __l: !_.isUndefined(self.__l) &&
            !_.isUndefined(self.request.__l) &&
            !_.isUndefined(self.req.__l)
        };
        return next();
      });
      describe('api', function() {
        it('should exist', function(done) {
          request(app.koa.listen()).get('/').expect({
            __: true,
            __l: true
          }, done);
        });
      });
    });
    // Express
    describe('express', function() {
      app.express.use(gengo.express(options));
      app.express.use(function(req, res) {
        res.send({
          __: !_.isUndefined(req.__) || false,
          __l: !_.isUndefined(req.__l) || false
        });
      });

      describe('api', function() {
        it('should exist', function(done) {
          request(app.express).get('/').expect({
            __: true,
            __l: true
          }, done);
        });
      });
    });
    // Hapi
    describe('hapi', function() {
      app.hapi.connection({
        port: 3000
      });
      app.hapi.register(gengo.hapi(options), function() {});
      describe('api', function() {
        it('should exist', function(done) {
          app.hapi.inject('/', function(res) {
            assert.isDefined(res.request.__);
            assert.isDefined(res.request.__l);
            done();
          });
        });
      });
    });
  });
});
