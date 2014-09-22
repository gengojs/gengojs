/*jslint node: true*/
/*global describe, before, it*/
var express = require('express'),
    cookieParser = require('cookie-parser'),
    gengo = require('../alpha.gengo.js'),
    request = require('supertest'),
    approot = require('app-root-path'),
    assert = require('assert'),
    app = express();

describe('Phrase test with default being en_US', function() {
    before(function(done) {
        gengo.config({
            default: 'en_US',
            supported: ['ja', 'en_US'],
            directory: approot + '/test/locales/',
            debug: {
                level: ['error', 'warn']
            }
        });
        app.use(gengo.init);
        app.get('/', function(req, res) {
            res.status(200).send({
                language: gengo.language()
            });
        });
        app.listen(3000);
        done();
    });

    it('Should find key: \"Home\" and print: ホーム', function(done) {
        request(app)
            .get('/')
            .set('Accept-Language', 'ja')
            .expect(200)
            .end(function(err, res) {
                if (err) {
                    throw err;
                }
                assert.equal("ホーム", gengo("Home"));
                done();
            });
    });
    it('Should find key: \"I\'m using %s\" and print: gengo.js をつかっています', function(done) {
        request(app)
            .get('/')
            .set('Accept-Language', 'ja')
            .expect(200)
            .end(function(err, res) {
                if (err) {
                    throw err;
                }
                assert.equal("gengo.js をつかっています", gengo("I'm using %s", 'gengo.js'));
                done();
            });
    });

    it('Should find key: \"I\'m using %s\" and print: gengo.js をつかっています', function(done) {
        request(app)
            .get('/')
            .set('Accept-Language', 'ja')
            .expect(200)
            .end(function(err, res) {
                if (err) {
                    throw err;
                }
                assert.equal("gengo.js をつかっています", gengo("I'm using %s", 'gengo.js'));
                done();
            });
    });

    it('Should find key: \"You are awesome.\" and print: あなたは凄い。', function(done) {
        request(app)
            .get('/')
            .set('Accept-Language', 'ja')
            .expect(200)
            .end(function(err, res) {
                if (err) {
                    throw err;
                }
                assert.equal("あなたは凄い。", gengo("You are awesome."));
                done();
            });
    });

    it('Should find key: \"You are awesome.\" and print in plural form: 私たちは凄い。', function(done) {
        request(app)
            .get('/')
            .set('Accept-Language', 'ja')
            .expect(200)
            .end(function(err, res) {
                if (err) {
                    throw err;
                }
                assert.equal("私たちは凄い。", gengo("You are awesome.", 2));
                done();
            });
    });
});

describe('Bracket test with default being en_US', function() {
    it('Should find key: \"navbar.home\" and print: ホーム', function(done) {
        request(app)
            .get('/')
            .set('Accept-Language', 'ja')
            .expect(200)
            .end(function(err, res) {
                if (err) {
                    throw err;
                }
                assert.equal("ホーム", gengo("navbar.home"));
                done();
            });
    });

    it('Should find key: \"navbar.about\" and print: アバウト', function(done) {
        request(app)
            .get('/')
            .set('Accept-Language', 'ja')
            .expect(200)
            .end(function(err, res) {
                if (err) {
                    throw err;
                }
                assert.equal("アバウト", gengo("navbar.about"));
                done();
            });
    });

});
