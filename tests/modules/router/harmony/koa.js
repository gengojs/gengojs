var koa = require('koa')
var app = koa()
var root = require('app-root-path');
var router = require(root + '/modules/router/');
var accept = require('gengojs-accept');
var request = require('supertest');
var assert = require('chai').assert;
var kroute = require('koa-router');
describe('router - koa', function() {
    //set routes
    //
    app.use(function * () {
        var result = router(accept(this).request, ['en-us']);
        this.body = {
            array: result.toArray(),
            dot: result.toDot()
        };
    });
    var index = kroute();
    index.get('/', function*(){})
    app.use(index.routes());

    var hello = kroute();
    hello.get('/hello', function*(){});
    app.use(hello.routes());

    var helloworld = kroute();
    helloworld.get('/hello/world', function*(){});
    app.use(helloworld.routes());

    var api = kroute();
    api.get('/api/v1.0', function*(){});
    app.use(api.routes());

    var api2 = kroute();
    api2.get('/api/v1.0/en-us', function*(){});
    app.use(api2.routes());

    it('router with request to "/" should === ["index"] && === "index"', function(done) {
        request(app.listen())
            .get('/')
            .expect(function(res) {
                var result = res.body;
                assert.deepEqual(result.array, ['index']);
                assert.strictEqual(result.dot, 'index');
            })
            .end(done);
    });

    it('router with request to "/hello" should === ["index", "hello"] && === "index.hello"', function(done) {
        request(app.listen())
            .get('/hello')
            .expect(function(res) {
                var result = res.body;
                assert.deepEqual(result.array, ['hello']);
                assert.strictEqual(result.dot, 'hello');
            })
            .end(done);
    });

    it('router with request to "/hello/world" should === ["index", "hello", "world"] && === "index.hello.world"', function(done) {
        request(app.listen())
            .get('/hello/world')
            .expect(function(res) {
                var result = res.body;
                assert.deepEqual(result.array, ['hello', 'world']);
                assert.strictEqual(result.dot, 'hello.world');
            })
            .end(done);
    });

    it('router with request to "/api/v1.0" should === ["index", "api", "v1*0"] && === "index.hello.v1*0"', function(done) {
        request(app.listen())
            .get('/api/v1.0')
            .expect(function(res) {
                var result = res.body;
                assert.deepEqual(result.array, ['api', 'v1*0']);
                assert.strictEqual(result.dot, 'api.v1*0');
            })
            .end(done);
    });
    it('router with request to "/api/v1.0/en" should === ["index", "api", "v1*0"] && === "index.hello.v1*0"', function(done) {
        request(app.listen())
            .get('/api/v1.0/en-us')
            .expect(function(res) {
                var result = res.body;
                assert.deepEqual(result.array, ['api', 'v1*0']);
                assert.strictEqual(result.dot, 'api.v1*0');
            })
            .end(done);
    });
});