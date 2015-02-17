var express = require('express')
var app = express()
var router = require('../modules/router');
var request = require('supertest');
var assert = require('assert');

describe('Begin module "router" tests', function() {
    app.use(function(req, res, next) {
        console.log(req.path);
        var result = router(req);
        res.send({
            array: result.toArray(),
            dot: result.toDot()
        });
    });
    app.get('/');
    app.get('/hello');
    app.get('/hello/world');
    app.get('/api/v1.0');

    var agent = request.agent(app);

    it('router with request to "/" should === ["index"] && === "index', function(done) {
        request(app)
            .get('/')
            .expect(function(res) {
                var result = res.body;
                assert.deepEqual(result.array, ['index']);
                assert.strictEqual(result.dot, 'index');
            })
            .end(done);
    });

    it('router with request to "/hello" should === ["index", "hello"] && === "index.hello"', function(done) {
        request(app)
            .get('/hello')
            .expect(function(res) {
                var result = res.body;
                assert.deepEqual(result.array, ['hello']);
                assert.strictEqual(result.dot, 'hello');
            })
            .end(done);
    });

    it('router with request to "/hello/world" should === ["index", "hello", "world"] && === "index.hello.world"', function(done) {
        request(app)
            .get('/hello/world')
            .expect(function(res) {
                var result = res.body;
                assert.deepEqual(result.array, ['hello', 'world']);
                assert.strictEqual(result.dot, 'hello.world');
            })
            .end(done);
    });

    it('router with request to "/api/v1.0" should === ["index", "api", "v1*0"] && === "index.hello.v1*0"', function(done) {
        request(app)
            .get('/api/v1.0')
            .expect(function(res) {
                var result = res.body;
                assert.deepEqual(result.array, ['api', 'v1*0']);
                assert.strictEqual(result.dot, 'api.v1*0');
            })
            .end(done);
    });

});
