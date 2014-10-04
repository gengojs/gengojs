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
describe('Begin JSON test', function() {

    before(function(done) {
        gengo.config({
            default: 'en-US',
            supported: ['ja', 'en-US'],
            extension: 'json',
            directory: approot + '/tests/locales/with JSON/',
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
    describe('Notation Tests', function() {
        describe('Phrase test with default being en-US', function() {

            it('Should find key: \"Home\" and print: ホーム with Accept-Language \'ja\'', function(done) {
                request(app)
                    .get('/')
                    .set('Accept-Language', 'ja')
                    .expect(200)
                    .end(function(error, res) {
                        if (error) {
                            throw error;
                        }
                        assert.equal(gengo("Home"), "ホーム");
                        done();
                    });
            });

            it('Should find key: \"Home\" and print: Home with Accept-Language \'de\'', function(done) {
                request(app)
                    .get('/')
                    .set('Accept-Language', 'de')
                    .expect(200)
                    .end(function(error, res) {
                        if (error) {
                            throw error;
                        }
                        assert.equal(gengo("Home"), "Home");
                        done();
                    });
            });

            it('Should find key: \"Home\" and print: Home with Accept-Language \'en_US\'', function(done) {
                request(app)
                    .get('/')
                    .set('Accept-Language', 'en_US')
                    .expect(200)
                    .end(function(error, res) {
                        if (error) {
                            throw error;
                        }
                        assert.equal(gengo("Home"), "Home");
                        done();
                    });
            });

            it('Should find key: \"I\'m using %s\" and print: gengo.js をつかっています', function(done) {
                request(app)
                    .get('/')
                    .set('Accept-Language', 'ja')
                    .expect(200)
                    .end(function(error, res) {
                        if (error) {
                            throw error;
                        }
                        assert.equal(gengo("I'm using %s", 'gengo.js'), "gengo.js をつかっています");
                        done();
                    });
            });
            it('Should find key: \"I\'m using %s\" and print: I\'m using gengo.js', function(done) {
                request(app)
                    .get('/')
                    .set('Accept-Language', 'en_US')
                    .expect(200)
                    .end(function(error, res) {
                        if (error) {
                            throw error;
                        }
                        assert.equal(gengo("I'm using %s", 'gengo.js'), "I'm using gengo.js");
                        done();
                    });
            });

            it('Should find key: \"You are awesome.\" and print: あなたは凄い。', function(done) {
                request(app)
                    .get('/')
                    .set('Accept-Language', 'ja')
                    .expect(200)
                    .end(function(error, res) {
                        if (error) {
                            throw error;
                        }
                        assert.equal(gengo("You are awesome."), "あなたは凄い。");
                        done();
                    });
            });

            it('Should find key: \"You are awesome.\" and print: You are awesome.', function(done) {
                request(app)
                    .get('/')
                    .set('Accept-Language', 'en_US')
                    .expect(200)
                    .end(function(error, res) {
                        if (error) {
                            throw error;
                        }
                        assert.equal(gengo("You are awesome."), "You are awesome.");
                        done();
                    });
            });

            it('Should find key: \"You are awesome.\" and print in plural form: 私たちは凄い。', function(done) {
                request(app)
                    .get('/')
                    .set('Accept-Language', 'ja')
                    .expect(200)
                    .end(function(error, res) {
                        if (error) {
                            throw error;
                        }
                        assert.equal(gengo("You are awesome.", 2), "私たちは凄い。");
                        done();
                    });
            });

            it('Should find key: \"You are awesome.\" and print in plural form: We are awesome.', function(done) {
                request(app)
                    .get('/')
                    .set('Accept-Language', 'en_US')
                    .expect(200)
                    .end(function(error, res) {
                        if (error) {
                            throw error;
                        }
                        assert.equal(gengo("You are awesome.", 2), "We are awesome.");
                        done();
                    });
            });

        });

        describe('Bracket test with default being en-US', function() {
            it('Should find key: \"navbar.home\" and print: ホーム', function(done) {
                request(app)
                    .get('/')
                    .set('Accept-Language', 'ja')
                    .expect(200)
                    .end(function(error, res) {
                        if (error) {
                            throw error;
                        }
                        assert.equal(gengo("[navbar.home]"), "ホーム");
                        done();
                    });
            });

            it('Should find key: \"navbar.home\" and print: Home', function(done) {
                request(app)
                    .get('/')
                    .set('Accept-Language', 'en_US')
                    .expect(200)
                    .end(function(error, res) {
                        if (error) {
                            throw error;
                        }
                        assert.equal(gengo("[navbar.home]"), "Home");
                        done();
                    });
            });

            it('Should find key: \"navbar.home\" and print: Maison', function(done) {
                request(app)
                    .get('/')
                    .set('Accept-Language', 'en_US')
                    .expect(200)
                    .end(function(error, res) {
                        if (error) {
                            throw error;
                        }
                        assert.equal(gengo("[navbar.home]", 'fr'), "Maison");
                        done();
                    });
            });

            it('Should find key: \"navbar.about\" and print: アバウト', function(done) {
                request(app)
                    .get('/')
                    .set('Accept-Language', 'ja')
                    .expect(200)
                    .end(function(error, res) {
                        if (error) {
                            throw error;
                        }
                        assert.equal(gengo("[navbar.about]"), "アバウト");
                        done();
                    });
            });

            it('Should find key: \"navbar.about\" and print: About', function(done) {
                request(app)
                    .get('/')
                    .set('Accept-Language', 'en_US')
                    .expect(200)
                    .end(function(error, res) {
                        if (error) {
                            throw error;
                        }
                        assert.equal(gengo("[navbar.about]"), "About");
                        done();
                    });
            });

            it('Should find key: \"bracket.dot.test\", subkey: \"plural\" and print: 私たち', function(done) {
                request(app)
                    .get('/')
                    .set('Accept-Language', 'ja')
                    .expect(200)
                    .end(function(error, res) {
                        if (error) {
                            throw error;
                        }
                        assert.equal(gengo("[bracket.dot.test].plural"), "私たち");
                        done();
                    });
            });

            it('Should find key: \"bracket.dot.test\", subkey: \"plural\" and print: We', function(done) {
                request(app)
                    .get('/')
                    .set('Accept-Language', 'en_US')
                    .expect(200)
                    .end(function(error, res) {
                        if (error) {
                            throw error;
                        }
                        assert.equal(gengo("[bracket.dot.test].plural"), "We");
                        done();
                    });
            });

        });

        describe('Dot test with default being en-US', function() {
            it('Should find key: \"navbar\", subkey: \"home\" and print: ホーム', function(done) {
                request(app)
                    .get('/')
                    .set('Accept-Language', 'ja')
                    .expect(200)
                    .end(function(error, res) {
                        if (error) {
                            throw error;
                        }
                        assert.equal(gengo("navbar.home"), "ホーム");
                        done();
                    });
            });

            it('Should find key: \"navbar\", subkey: \"home\" and print: Home', function(done) {
                request(app)
                    .get('/')
                    .set('Accept-Language', 'en_US')
                    .expect(200)
                    .end(function(error, res) {
                        if (error) {
                            throw error;
                        }
                        assert.equal(gengo("navbar.home"), "Home");
                        done();
                    });
            });
            it('Should find key: \"navbar\", subkey: \"about\", subkey: \"special\" and print: スペシャル', function(done) {
                request(app)
                    .get('/')
                    .set('Accept-Language', 'ja')
                    .expect(200)
                    .end(function(error, res) {
                        if (error) {
                            throw error;
                        }
                        assert.equal(gengo("navbar.about.special"), "スペシャル");
                        done();
                    });
            });
            it('Should find key: \"navbar\", subkey: \"about\", subkey: \"special\" and print: Special', function(done) {
                request(app)
                    .get('/')
                    .set('Accept-Language', 'en_US')
                    .expect(200)
                    .end(function(error, res) {
                        if (error) {
                            throw error;
                        }
                        assert.equal(gengo("navbar.about.special"), "Special");
                        done();
                    });
            });
        });

        describe('Object test with default being en-US', function() {

            it('Should find key: \"Home\" and print: ホーム', function(done) {
                request(app)
                    .get('/')
                    .set('Accept-Language', 'ja')
                    .expect(200)
                    .end(function(error, res) {
                        if (error) {
                            throw error;
                        }
                        assert.equal(gengo({
                            phrase: "Home"
                        }), "ホーム");
                        done();
                    });
            });

            it('Should find key: \"Home\" and print: Home', function(done) {
                request(app)
                    .get('/')
                    .set('Accept-Language', 'en_US')
                    .expect(200)
                    .end(function(error, res) {
                        if (error) {
                            throw error;
                        }
                        assert.equal(gengo({
                            phrase: "Home"
                        }), "Home");
                        done();
                    });
            });

            it('Should find key: \"navbar.home\" and print: ホーム', function(done) {
                request(app)
                    .get('/')
                    .set('Accept-Language', 'ja')
                    .expect(200)
                    .end(function(error, res) {
                        if (error) {
                            throw error;
                        }
                        assert.equal(gengo({
                            phrase: "[navbar.home]"
                        }), "ホーム");
                        done();
                    });
            });

            it('Should find key: \"navbar.home\" and print: Home', function(done) {
                request(app)
                    .get('/')
                    .set('Accept-Language', 'en_US')
                    .expect(200)
                    .end(function(error, res) {
                        if (error) {
                            throw error;
                        }
                        assert.equal(gengo({
                            phrase: "[navbar.home]"
                        }), "Home");
                        done();
                    });
            });

            it('Should find key: \"navbar\", subkey: \"home\" and print: ホーム', function(done) {
                request(app)
                    .get('/')
                    .set('Accept-Language', 'ja')
                    .expect(200)
                    .end(function(error, res) {
                        if (error) {
                            throw error;
                        }
                        assert.equal(gengo({
                            phrase: "navbar.home"
                        }), "ホーム");
                        done();
                    });
            });

            it('Should find key: \"navbar\", subkey: \"home\" and print: Home', function(done) {
                request(app)
                    .get('/')
                    .set('Accept-Language', 'en_US')
                    .expect(200)
                    .end(function(error, res) {
                        if (error) {
                            throw error;
                        }
                        assert.equal(gengo({
                            phrase: "navbar.home"
                        }), "Home");
                        done();
                    });
            });
            it('Should find key: \"navbar\", subkey: \"about\", subkey: \"special\" and print: スペシャル', function(done) {
                request(app)
                    .get('/')
                    .set('Accept-Language', 'ja')
                    .expect(200)
                    .end(function(error, res) {
                        if (error) {
                            throw error;
                        }
                        assert.equal(gengo({
                            phrase: "navbar.about.special"
                        }), "スペシャル");
                        done();
                    });
            });
            it('Should find key: \"navbar\", subkey: \"about\", subkey: \"special\" and print: Special', function(done) {
                request(app)
                    .get('/')
                    .set('Accept-Language', 'en_US')
                    .expect(200)
                    .end(function(error, res) {
                        if (error) {
                            throw error;
                        }
                        assert.equal(gengo({
                            phrase: "navbar.about.special"
                        }), "Special");
                        done();
                    });
            });

            it('Should find key: \"dot\", subkey: \"test\", subkey: \"array\" and print: ' + [
                "This is a paragraph. ",
                ".................... ",
                "...................."
            ].join('\n'), function(done) {
                request(app)
                    .get('/')
                    .set('Accept-Language', 'en_US')
                    .expect(200)
                    .end(function(error, res) {
                        if (error) {
                            throw error;
                        }
                        assert.equal(gengo({
                            phrase: "dot.test.array"
                        }), [
                            "This is a paragraph. ",
                            ".................... ",
                            "...................."
                        ].join('\n'));
                        done();
                    });
            });
        });
    });

    after(function(done) {
        server.close();
        var name = require.resolve('../gengo.js');
        delete require.cache[name];
        done();
    });
});
