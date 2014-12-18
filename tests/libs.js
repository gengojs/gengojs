/*jslint node: true*/
/*global describe, before, it, after*/
var express = require('express'),
    gengo = new require('../gengo.js'),
    request = require('supertest'),
    approot = require('app-root-path'),
    assert = require('assert'),
    app = express(),
    server;

gengo.config({
    default: 'en-US',
    supported: ['ja', 'en-US'],
    directory:{path: __dirname + '/locales/'}
});

app.use(gengo.init);
app.get('/', function(req, res) {
    res.status(200).send({
        language: gengo.language(),
    });
});
describe('Begin library test', function() {
    before(function(done) {
        server = app.listen(3000);
        done();
    });

    describe('Moment test', function() {

        it('Should return the locale \'ja\'', function(done) {
            request(app)
                .get('/')
                .set('Accept-Language', 'ja')
                .expect(200)
                .end(function(error, res) {
                    if (error) {
                        throw error;
                    }
                    assert.equal(gengo.moment().locale(), "ja");
                    done();
                });
        });
        it('Should return the global locale \'ja\' with the Accept-Language in \'ja\'', function(done) {
            request(app)
                .get('/')
                .set('Accept-Language', 'en_US')
                .expect(200)
                .end(function(error, res) {
                    if (error) {
                        throw error;
                    }
                    assert.equal(gengo.moment().locale(), "en");
                    done();
                });
        });

        it('Should return the local locale \'fr\' with the Accept-Language in \'ja\'', function(done) {
            request(app)
                .get('/')
                .set('Accept-Language', 'ja')
                .expect(200)
                .end(function(error, res) {
                    if (error) {
                        throw error;
                    }
                    assert.equal(gengo.moment({
                        locale: 'fr'
                    }).locale(), "fr");
                    done();
                });
        });
        it('Should be able to use multiple arguments.', function(done) {
            request(app)
                .get('/')
                .set('Accept-Language', 'en_US')
                .expect(200)
                .end(function(error, res) {
                    if (error) {
                        throw error;
                    }
                    assert.equal(gengo.moment("2010 11 31", "YYYY MM DD").isValid(), false);
                    done();
                });
        });

        it('Should be able to use multiple arguments with locale \'ja\'.', function(done) {
            request(app)
                .get('/')
                .set('Accept-Language', 'en_US')
                .expect(200)
                .end(function(error, res) {
                    if (error) {
                        throw error;
                    }
                    assert.equal(gengo.moment("2010 11 31", "YYYY MM DD", {
                        locale: 'ja'
                    }).isValid(), false);
                    done();
                });
        });
    });

    describe('Numeral test', function() {
        //todo
        it('Should print in US dollars with Accept-Language in \'ja\'', function(done) {
            request(app)
                .get('/')
                .set('Accept-Language', 'ja')
                .expect(200)
                .end(function(error, res) {
                    if (error) {
                        throw error;
                    }
                    assert.equal(gengo.numeral(25, {
                        locale: 'en'
                    }).format('$0.00'), "$25.00");
                    done();
                });
        });

        it('Should print in Japan Yen with Accept-Language in \'ja\'', function(done) {
            request(app)
                .get('/')
                .set('Accept-Language', 'ja')
                .expect(200)
                .end(function(error, res) {
                    if (error) {
                        throw error;
                    }
                    assert.equal(gengo.numeral(25).format('$0.00'), "¥25.00");
                    done();
                });
        });

        it('Should print in Japan Yen with Accept-Language in \'en_US\'', function(done) {
            request(app)
                .get('/')
                .set('Accept-Language', 'en_US')
                .expect(200)
                .end(function(error, res) {
                    if (error) {
                        throw error;
                    }
                    assert.equal(gengo.numeral(25, {
                        locale: 'ja'
                    }).format('$0.00'), "¥25.00");
                    done();
                });
        });

        it('Should print in US dollars with Accept-Language in \'en_US\'', function(done) {
            request(app)
                .get('/')
                .set('Accept-Language', 'en_US')
                .expect(200)
                .end(function(error, res) {
                    if (error) {
                        throw error;
                    }
                    assert.equal(gengo.numeral(25).format('$0.00'), "$25.00");
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
