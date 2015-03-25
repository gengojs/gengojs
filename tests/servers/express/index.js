var assert = require('chai').assert;
var root = require('app-root-path');
var gengo = require(root + '/index');
var request = require('supertest');

describe('gengo - express', function() {
    describe('existence', function() {
        var express = require('express');
        var app = express();
        
        app.use(gengo({
        	directory:root + '/tests/locales/unrouted/dest'
        }));
        app.get('/');
        
        app.listen(3000);

        it('should be attached to the request', function(done) {
        	app.use(function (req, res, next) {
        		assert.isDefined(req.__);
        		assert.isDefined(req.__l);
        		next();
        	});
        	request(app).get('/').end(done);
        });

        it('should be attached to the locals', function(done) {
        	app.use(function (req, res, next) {
        		assert.isDefined(res.locals.__);
        		assert.isDefined(res.locals.__l);
        		next();
        	});
        	request(app).get('/').end(done);
        });
    });
});