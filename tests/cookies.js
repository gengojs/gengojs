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

describe('Begin cookie test', function () {
    before(function (done) {
        gengo.config({
            default: 'en-US',
            supported: ['ja', 'en-US'],
            directory: {path: __dirname + '/locales/'},
            debug: ['error', 'warn']
        });
        app.use(cookieParser());
        app.use(gengo.init);
        app.get('/', function (req, res) {
            res.status(200).send({
                language: gengo.language()
            });
        });

        request(app)
            .get('/')
            .set('Accept-Language', 'ja')
            .set('Cookie', 'locale=null')
            .expect(200)
            .end(function (error, res) {
                if (error) {
                    throw error;
                }
            });
        server = app.listen(3000);
        done();
    });
    describe('Set cookie to en_US and translate everything in English', function () {

        describe('Phrase test with cookie set to en-US', function () {
            it('Should print: Home and Accept-Language to ja', function (done) {
                request(app)
                    .get('/')
                    .set('Accept-Language', 'ja')
                    .set('Cookie', 'locale=en-US')
                    .expect(200)
                    .end(function (error, res) {
                        if (error) {
                            throw error;
                        }
                        assert.equal(gengo("Home"), "Home");
                        done();
                    });
            });

            it('Should print: Home and Accept-Language to en_US', function (done) {
                request(app)
                    .get('/')
                    .set('Accept-Language', 'en_US')
                    .set('Cookie', 'locale=en-US')
                    .expect(200)
                    .end(function (error, res) {
                        if (error) {
                            throw error;
                        }
                        assert.equal(gengo("Home"), "Home");
                        done();
                    });
            });
        });

        describe('Bracket test with cookie set to en-US and Accept-Language to ja', function () {
            it('Should print: Home', function (done) {
                request(app)
                    .get('/')
                    .set('Accept-Language', 'ja')
                    .set('Cookie', 'locale=en_US')
                    .expect(200)
                    .end(function (error, res) {
                        if (error) {
                            throw error;
                        }
                        assert.equal(gengo("[navbar.home]"), "Home");
                        done();
                    });
            });

            it('Should print: Home and Accept-Language to en_US', function (done) {
                request(app)
                    .get('/')
                    .set('Accept-Language', 'en_US')
                    .set('Cookie', 'locale=en_US')
                    .expect(200)
                    .end(function (error, res) {
                        if (error) {
                            throw error;
                        }
                        assert.equal(gengo("[navbar.home]"), "Home");
                        done();
                    });
            });
        });

        describe('Dot test with cookie set to en-US', function () {
            it('Should print: Home', function (done) {
                request(app)
                    .get('/')
                    .set('Accept-Language', 'ja')
                    .set('Cookie', 'locale=en_US')
                    .expect(200)
                    .end(function (error, res) {
                        if (error) {
                            throw error;
                        }
                        assert.equal(gengo("navbar.home"), "Home");
                        done();
                    });
            });

            it('Should print: Home', function (done) {
                request(app)
                    .get('/')
                    .set('Accept-Language', 'en_US')
                    .set('Cookie', 'locale=en_US')
                    .expect(200)
                    .end(function (error, res) {
                        if (error) {
                            throw error;
                        }
                        assert.equal(gengo("navbar.home"), "Home");
                        done();
                    });
            });
        });

        describe('Object test with cookie set to en-US', function () {
            it('Should print: Home', function (done) {
                request(app)
                    .get('/')
                    .set('Accept-Language', 'ja')
                    .set('Cookie', 'locale=en_US')
                    .expect(200)
                    .end(function (error, res) {
                        if (error) {
                            throw error;
                        }
                        assert.equal(gengo({
                            phrase: "navbar.home"
                        }), "Home");
                        done();
                    });
            });

            it('Should print: Home', function (done) {
                request(app)
                    .get('/')
                    .set('Accept-Language', 'en_US')
                    .set('Cookie', 'locale=en_US')
                    .expect(200)
                    .end(function (error, res) {
                        if (error) {
                            throw error;
                        }
                        assert.equal(gengo({
                            phrase: "navbar.home"
                        }), "Home");
                        done();
                    });
            });
        });

    });

    describe('Set cookie to ja and translate everything in Japanese', function () {

        describe('Phrase test with cookie set to en-US', function () {
            it('Should print: ホーム', function (done) {
                request(app)
                    .get('/')
                    .set('Accept-Language', 'ja')
                    .set('Cookie', 'locale=ja')
                    .expect(200)
                    .end(function (error, res) {
                        if (error) {
                            throw error;
                        }
                        assert.equal(gengo("Home"), "ホーム");
                        done();
                    });
            });

            it('Should print: ホーム', function (done) {
                request(app)
                    .get('/')
                    .set('Accept-Language', 'en_US')
                    .set('Cookie', 'locale=ja')
                    .expect(200)
                    .end(function (error, res) {
                        if (error) {
                            throw error;
                        }
                        assert.equal(gengo("Home"), "ホーム");
                        done();
                    });
            });
        });

        describe('Bracket test with cookie set to en-US', function () {
            it('Should print: ホーム', function (done) {
                request(app)
                    .get('/')
                    .set('Accept-Language', 'ja')
                    .set('Cookie', 'locale=ja')
                    .expect(200)
                    .end(function (error, res) {
                        if (error) {
                            throw error;
                        }
                        assert.equal(gengo("[navbar.home]"), "ホーム");
                        done();
                    });
            });

            it('Should print: ホーム', function (done) {
                request(app)
                    .get('/')
                    .set('Accept-Language', 'en_US')
                    .set('Cookie', 'locale=ja')
                    .expect(200)
                    .end(function (error, res) {
                        if (error) {
                            throw error;
                        }
                        assert.equal(gengo("[navbar.home]"), "ホーム");
                        done();
                    });
            });
        });

        describe('Dot test with cookie set to en-US', function () {
            it('Should print: ホーム', function (done) {
                request(app)
                    .get('/')
                    .set('Accept-Language', 'ja')
                    .set('Cookie', 'locale=ja')
                    .expect(200)
                    .end(function (error, res) {
                        if (error) {
                            throw error;
                        }
                        assert.equal(gengo("navbar.home"), "ホーム");
                        done();
                    });
            });

            it('Should print: ホーム', function (done) {
                request(app)
                    .get('/')
                    .set('Accept-Language', 'en_US')
                    .set('Cookie', 'locale=ja')
                    .expect(200)
                    .end(function (error, res) {
                        if (error) {
                            throw error;
                        }
                        assert.equal(gengo("navbar.home"), "ホーム");
                        done();
                    });
            });
        });

        describe('Object test with cookie set to en-US', function () {
            it('Should print: ホーム', function (done) {
                request(app)
                    .get('/')
                    .set('Accept-Language', 'ja')
                    .set('Cookie', 'locale=ja')
                    .expect(200)
                    .end(function (error, res) {
                        if (error) {
                            throw error;
                        }
                        assert.equal(gengo({
                            phrase: "navbar.home"
                        }), "ホーム");
                        done();
                    });
            });

            it('Should print: ホーム', function (done) {
                request(app)
                    .get('/')
                    .set('Accept-Language', 'en_US')
                    .set('Cookie', 'locale=ja')
                    .expect(200)
                    .end(function (error, res) {
                        if (error) {
                            throw error;
                        }
                        assert.equal(gengo({
                            phrase: "navbar.home"
                        }), "ホーム");
                        done();
                    });
            });
        });

    });

    describe('Set cookie but override the locale and print in French', function () {
        describe('Set cookie to ja and locale to fr', function () {
            it('Should print: Maison', function (done) {
                request(app)
                    .get('/')
                    .set('Accept-Language', 'ja')
                    .set('Cookie', 'locale=ja')
                    .expect(200)
                    .end(function (error, res) {
                        if (error) {
                            throw error;
                        }
                        assert.equal(gengo({
                            phrase: "navbar.home",
                            locale: 'fr'
                        }), "Maison");
                        done();
                    });
            });

            it('Should print: Maison', function (done) {
                request(app)
                    .get('/')
                    .set('Accept-Language', 'en_US')
                    .set('Cookie', 'locale=ja')
                    .expect(200)
                    .end(function (error, res) {
                        if (error) {
                            throw error;
                        }
                        assert.equal(gengo({
                            phrase: "navbar.home",
                            locale: 'fr'
                        }), "Maison");
                        done();
                    });
            });
        });
    });
    after(function (done) {
        request(app)
            .get('/')
            .set('Cookie', 'locale=null')
            .expect(200)
            .end(function (error, res) {
                if (error) {
                    throw error;
                }
            });
        server.close();
        done();
    });
});
