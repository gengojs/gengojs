var request = require('supertest'),
    express = require('express');

var app = express();
var cookieParser = require('cookie-parser')

app.use(cookieParser());
var gengo = require("../../gengo.js");
var assert = require("assert")

gengo.config({
    gengo: 'gengo',
    debug: false,
    supported: ['ja', 'en', 'en_US'],
    default: 'ja',
    localePath: "./sample/locales/",
    routeAware: true
});

gengo.init(app);

app.get('/', function(req, res) {
    res.send(200, {
        language: gengo.language()
    });
});

describe('Request with Accept-Language: ja', function() {
    before(function() {
        console.log("    Test: translate.js");
    });

    it('gengo should not translate but return in Japanese', function(done) {
        request(app)
            .get('/')
            .set('Accept-Language', 'ja')
            .expect(200)
            .end(function(error, res) {
                if (error) {
                    throw error;
                }
                assert.equal("エクスプレスへようこそ", gengo("エクスプレスへようこそ"));
                done();
            });

    });

});

describe('Request with Accept-Language: en_US', function() {

    it('gengo should translate and return in English US', function(done) {
        request(app)
            .get('/')
            .set('Accept-Language', 'en-US')
            .expect(200)
            .end(function(error, res) {
                if (error) {
                    throw error;
                }
                assert.equal("Welcome to express", gengo("エクスプレスへようこそ"));
                done();
            });

    });

});

describe('Request with Accept-Language: en', function() {

    it('gengo should translate and return in English', function(done) {
        request(app)
            .get('/')
            .set('Accept-Language', 'en')
            .expect(200)
            .end(function(error, res) {
                if (error) {
                    throw error;
                }
                assert.equal("Welcome to express", gengo("エクスプレスへようこそ"));
                done();
            });

    });

});
