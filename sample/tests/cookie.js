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
        language: gengo.language(),
        locale: gengo.locale()
    });
});

describe('Request with Accept-Language: ja and set Cookie to en_US', function() {
    before(function() {
        console.log("    Test: cookie.js");
    });

    it('Language should return English US', function(done) {
        request(app)
            .get('/')
            .set('Accept-Language', 'ja')
            .set('Cookie', "locale=en_US")
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
            .set('Accept-Language', 'ja')
            .set('Cookie', "locale=en_US")
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

describe('Request with Accept-Language: en_US and set Cookie to en_US', function() {


    it('Language should return English US', function(done) {
        request(app)
            .get('/')
            .set('Accept-Language', 'en-US')
            .set('Cookie', "locale=en_US")
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
            .set('Accept-Language', 'ja')
            .set('Cookie', "locale=en_US")
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

describe('Request with Accept-Language: en and set Cookie to en_US', function() {

    it('Language should return English US', function(done) {
        request(app)
            .get('/')
            .set('Accept-Language', 'en')
            .set('Cookie', "locale=en_US")
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
            .set('Accept-Language', 'ja')
            .set('Cookie', "locale=en_US")
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

describe('Request with Accept-Language: ja and set Cookie to a string with value null', function() {

    it('Language should return Japanese', function(done) {
        request(app)
            .get('/')
            .set('Accept-Language', 'ja')
            .set('Cookie', "locale=null")
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
            .set('Cookie', "locale=null")
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
