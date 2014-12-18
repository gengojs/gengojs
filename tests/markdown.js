/*jslint node: true*/
/*global describe, before, it, after*/
var express = require('express'),
    gengo = require('../gengo.js'),
    request = require('supertest'),
    approot = require('app-root-path'),
    assert = require('assert'),
    app = express(),
    server;

gengo.config({
    default: 'en-US',
    supported: ['ja', 'en-US'],
    directory: {
        path: __dirname + '/locales/'
    },
    markdown: true
});

app.use(gengo.init);
app.get('/', function(req, res) {
    res.status(200).send({
        language: gengo.language(),
    });
});
describe('Begin Markdown Test', function() {
    before(function(done) {
        server = app.listen(3000);
        done();
    });

    describe('Bold test', function() {

        it('Should return html in a phrase with the Accept-Language in \'ja\'', function(done) {
            request(app)
                .get('/')
                .set('Accept-Language', 'ja')
                .expect(200)
                .end(function(error, res) {
                    if (error) {
                        throw error;
                    }
                    assert.equal(gengo('Bold is **awesome**.'), '太字は<strong>すごい</strong>。');
                    done();
                });
        });

        it('Should return html in a phrase with the Accept-Language in \'ja\'', function(done) {
            request(app)
                .get('/')
                .set('Accept-Language', 'ja')
                .expect(200)
                .end(function(error, res) {
                    if (error) {
                        throw error;
                    }
                    assert.equal(gengo('Bold is __awesome__.'), '太字は<strong>すごい</strong>。');
                    done();
                });
        });

    });

    describe('Italic test', function() {

        it('Should return html in a phrase with Accept-Language in \'ja\'', function(done) {
            request(app)
                .get('/')
                .set('Accept-Language', 'ja')
                .expect(200)
                .end(function(error, res) {
                    if (error) {
                        throw error;
                    }
                    assert.equal(gengo('Italic is *awesome*.'), 'イタリックは<em>すごい</em>。');
                    done();
                });
        });

        it('Should return html in a phrase with Accept-Language in \'ja\'', function(done) {
            request(app)
                .get('/')
                .set('Accept-Language', 'ja')
                .expect(200)
                .end(function(error, res) {
                    if (error) {
                        throw error;
                    }
                    assert.equal(gengo('Italic is _awesome_.'), 'イタリックは<em>すごい</em>。');
                    done();
                });
        });

    });

    describe('Code test', function() {

        it('Should return html in a phrase with Accept-Language in \'ja\'', function(done) {
            request(app)
                .get('/')
                .set('Accept-Language', 'ja')
                .expect(200)
                .end(function(error, res) {
                    if (error) {
                        throw error;
                    }
                    assert.equal(gengo('Code is `awesome`.'), 'コードは<code>すごい</code>。');
                    done();
                });
        });

        it('Should return html in a phrase with Accept-Language in \'ja\'', function(done) {
            request(app)
                .get('/')
                .set('Accept-Language', 'ja')
                .expect(200)
                .end(function(error, res) {
                    if (error) {
                        throw error;
                    }
                    assert.equal(gengo('Code is `__`.'), 'コードは<code>__</code>。');
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