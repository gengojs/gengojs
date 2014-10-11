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

describe('Begin Route test', function() {
    before(function(done) {
        gengo.config({
            default: 'en-US',
            router: true,
            //not nessesary but since routes.js comes after
            //json.js, we'll add the extension to prevent errors.
            extension: 'js',
            supported: ['ja', 'en-US'],
            directory:'/tests/locales/with routes/',
            debug: ['error', 'warn']
        });
        app.use(gengo.init);
        app.get('/', function(req, res) {
            var router = require('../modules/router.js');
            var dot = router().route().dot();
            res.status(200).send({
                language: gengo.language(),
                dot: dot
            });
        });

        app.get('/second/', function(req, res) {
            var router = require('../modules/router.js');
            var dot = router().route().dot();
            res.status(200).send({
                language: gengo.language(),
                dot: dot
            });
        });

        app.get('/second/third', function(req, res) {
            var router = require('../modules/router.js');
            var dot = router().route().dot();
            res.status(200).send({
                language: gengo.language(),
                dot: dot
            });
        });

        server = app.listen(3000);
        done();
    });
    describe('Routes will return in dot notation unless it\'s a root', function() {
        it('Should return: index', function(done) {
            request(app)
                .get('/')
                .set('Accept-Language', 'en_US')
                .expect(200)
                .end(function(error, res) {
                    if (error) {
                        throw error;
                    }
                    assert.equal(res.body.dot, "index");
                    done();
                });
        });

        it('Should return: second', function(done) {
            request(app)
                .get('/second')
                .set('Accept-Language', 'en_US')
                .expect(200)
                .end(function(error, res) {
                    if (error) {
                        throw error;
                    }
                    assert.equal(res.body.dot, "second");
                    done();
                });
        });

        it('Should return: second.third', function(done) {
            request(app)
                .get('/second/third')
                .set('Accept-Language', 'en_US')
                .expect(200)
                .end(function(error, res) {
                    if (error) {
                        throw error;
                    }
                    assert.equal(res.body.dot, "second.third");
                    done();
                });
        });
    });
    describe('Gengo should be able to find its definitions within their routes', function() {


        it('Should print: ホーム using \'/\'', function(done) {
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

        it('Should print: ホーム using \'/second\'', function(done) {
            request(app)
                .get('/second')
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

        it('Should print: ホーム using \'second/third\'', function(done) {
            request(app)
                .get('/second/third')
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

        it('Should print: Home using \'/\'', function(done) {
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

        it('Should print: Home using \'/second\'', function(done) {
            request(app)
                .get('/second')
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

        it('Should print: Home using \'second/third\'', function(done) {
            request(app)
                .get('/second/third')
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

        it('Should print: Maison using \'/\'', function(done) {
            request(app)
                .get('/')
                .set('Accept-Language', 'en_US')
                .expect(200)
                .end(function(error, res) {
                    if (error) {
                        throw error;
                    }
                    assert.equal(gengo("[navbar.home]", {
                        locale: 'fr'
                    }), "Maison");
                    done();
                });
        });

        it('Should print: Maison using \'/second\'', function(done) {
            request(app)
                .get('/second')
                .set('Accept-Language', 'en_US')
                .expect(200)
                .end(function(error, res) {
                    if (error) {
                        throw error;
                    }
                    assert.equal(gengo("[navbar.home]", {
                        locale: 'fr'
                    }), "Maison");
                    done();
                });
        });

        it('Should print: Maison using \'second/third\'', function(done) {
            request(app)
                .get('/second/third')
                .set('Accept-Language', 'en_US')
                .expect(200)
                .end(function(error, res) {
                    if (error) {
                        throw error;
                    }
                    assert.equal(gengo("[navbar.home]", {
                        locale: 'fr'
                    }), "Maison");
                    done();
                });
        });

    });

    describe('Notation Tests with routes', function() {
        describe('Phrase test with default being en-US', function() {

            it('Should find key: \"Home\" and print: ホーム', function(done) {
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

            it('Should find key: \"Home\" and print: Home', function(done) {
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
        });
    });
    describe('Universe test', function() {
        it('Should print: ホーム with Accept-Language \'ja\' using brackets', function(done) {
            request(app)
                .get('/')
                .set('Accept-Language', 'ja')
                .expect(200)
                .end(function(error, res) {
                    if (error) {
                        throw error;
                    }
                    assert.equal(gengo("[navbar.gengo]"), "ホーム");
                    done();
                });
        });

        it('Should print: これはgengo.jsテストです！！ with Accept-Language \'ja\' using dots', function(done) {
            request(app)
                .get('/')
                .set('Accept-Language', 'ja')
                .expect(200)
                .end(function(error, res) {
                    if (error) {
                        throw error;
                    }
                    assert.equal(gengo("gengo.test", "gengo.js"), "これはgengo.jsテストです！！");
                    done();
                });
        });
        it('Should print: This is a gengo.js test!! with Accept-Language \'en_US\' using phrase', function(done) {
            request(app)
                .get('/')
                .set('Accept-Language', 'en_US')
                .expect(200)
                .end(function(error, res) {
                    if (error) {
                        throw error;
                    }
                    assert.equal(gengo("This is a %s test!!", "gengo.js"), "This is a gengo.js test!!");
                    done();
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
