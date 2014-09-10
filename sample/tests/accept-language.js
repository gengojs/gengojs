var request = require('supertest'),
    express = require('express');

var app = express();

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
    res.status(200).send({
        language: gengo.language(),
        locale: gengo.locale()
    });
});


describe('Request with Accept-Language: ja', function() {
    before(function() {
        console.log("    Test: accept-language.js");
    });
    it('Language should return Japanese', function(done) {
        request(app)
            .get('/')
            .set('Accept-Language', 'ja')
            .expect(200)
            .end(function(error, res) {
                if (error) {
                    throw error;
                }
                assert.equal("Japanese", res.body.language);
                done();
            });

    });

    it('Locale should return ja', function(done) {
        request(app)
            .get('/')
            .set('Accept-Language', 'ja')
            .expect(200)
            .end(function(error, res) {
                if (error) {
                    throw error;
                }
                assert.equal("ja", res.body.locale);
                done();
            });

    });

});

describe('Request with Accept-Language: en_US', function() {

    it('Language should return English US', function(done) {
        request(app)
            .get('/')
            .set('Accept-Language', 'en-US')
            .expect(200)
            .end(function(error, res) {
                if (error) {
                    throw error;
                }
                assert.equal("English US", res.body.language);
                done();
            });

    });

    it('Locale should return en_US', function(done) {
        request(app)
            .get('/')
            .set('Accept-Language', 'en-US')
            .expect(200)
            .end(function(error, res) {
                if (error) {
                    throw error;
                }
                assert.equal("en_US", res.body.locale);
                done();
            });

    });

});

describe('Request with Accept-Language: en', function() {

    it('Language should return English', function(done) {
        request(app)
            .get('/')
            .set('Accept-Language', 'en')
            .expect(200)
            .end(function(error, res) {
                if (error) {
                    throw error;
                }
                assert.equal("English", res.body.language);
                done();
            });
    });

    it('Locale should return en', function(done) {
        request(app)
            .get('/')
            .set('Accept-Language', 'en')
            .expect(200)
            .end(function(error, res) {
                if (error) {
                    throw error;
                }
                assert.equal("en", res.body.locale);
                done();
            });
    });

});
