var config = require('../modules/config');
var mocha = require('mocha');
var assert = require('chai').assert;
var path = require('path');

describe('Begin configuration tests', function() {
    describe('Begin test with module "config"', function() {

        describe('with default settings', function() {
            it('The global identifier should === "__"', function(done) {
                assert.strictEqual(config().id(), "__");
                done();
            });

            it('The directory should === "' + path.normalize(path.resolve('./locales')).replace(path.normalize('/tests'), '') + '" ', function(done) {
                assert.strictEqual(config().directory(), path.normalize(path.resolve('./locales')).replace(path.normalize('/tests'), ''));
                done();
            });

            it('The supported locales should === ["en-us"]', function(done) {
                assert.deepEqual(config().supported(), ['en-us']);
                done();
            });

            it('The locale should === "en-us"', function(done) {
                assert.strictEqual(config().default(), 'en-us');
                done();
            });

            it('The router setting should === false', function(done) {
                assert.strictEqual(config().isRouter(), false);
                done();
            });

            it('The markdown setting should === false', function(done) {
                assert.strictEqual(config().isMarkdown(), false);
                done();
            });

            it('The extension should === "json"', function(done) {
                assert.strictEqual(config().extension(), '.json');
                done();
            });

            it('The keywords should === "{default: "default",translated: "translated",universe: "gengo", plural: "plural"}"', function(done) {
                assert.deepEqual(config().keywords(), {
                    default: 'default',
                    translated: 'translated',
                    universe: 'gengo',
                    plural: 'plural'
                });
                done();
            });

            it('The prefix should === ""', function(done) {
                assert.strictEqual(config().prefix(), "");
                done();
            });

            it('The template should === "{{" && "}}"', function(done) {
                var template = config().template();
                assert.strictEqual(template.open, '{{');
                assert.strictEqual(template.close, '}}');
                done();
            });
        });

        describe('with configured settings', function() {
            it('The configured global identifier should === "_g"', function(done) {
                assert.strictEqual(config({
                    global: '_g'
                }).id(), "_g");
                done();
            });
            it('The directory should === "' + path.normalize(path.resolve('./xfolder')).replace(path.normalize('/tests'), '') + '" ', function(done) {

                assert.strictEqual(config({
                    directory: './xfolder'
                }).directory(), path.normalize(path.resolve('./xfolder')).replace(path.normalize('/tests'), ''));
                assert.strictEqual(config({
                    directory: '/xfolder'
                }).directory(), path.normalize(path.resolve('./xfolder')).replace(path.normalize('/tests'), ''));
                done();
            });



            it('The supported locales should === ["en-us", "ja", "es"]', function(done) {
                assert.deepEqual(config({
                    supported: ['en-US', 'ja', 'es']
                }).supported(), ['en-us', 'ja', 'es']);
                done();
            });



            it('The locale should === "ja"', function(done) {
                assert.strictEqual(config({
                    default: 'ja'
                }).default(), 'ja');
                done();
            });



            it('The router setting should === true', function(done) {
                assert.strictEqual(config({
                    router: true
                }).isRouter(), true);
                done();
            });



            it('The markdown setting should === true', function(done) {
                assert.strictEqual(config({
                    markdown: true
                }).isMarkdown(), true);
                done();
            });



            it('The extension should === "js"', function(done) {
                assert.strictEqual(config({
                    extension: 'js'
                }).extension(), '.js');
                assert.strictEqual(config({
                    extension: '.js'
                }).extension(), '.js');
                assert.strictEqual(config({
                    extension: '.JS'
                }).extension(), '.js');
                done();
            });



            it('The keywords should === "{default: "a",translated: "b",universe: "c", plural: "d"}"', function(done) {
                assert.deepEqual(config({
                    keywords: {
                        default: 'a',
                        translated: 'b',
                        universe: 'c',
                        plural: 'd'
                    }
                }).keywords(), {
                    default: 'a',
                    translated: 'b',
                    universe: 'c',
                    plural: 'd'
                });

                assert.deepEqual(config({
                    keywords: {
                        translated: 'b',
                        universe: 'c',
                        plural: 'd'
                    }
                }).keywords(), {
                    default: 'default',
                    translated: 'b',
                    universe: 'c',
                    plural: 'd'
                });
                done();
            });



            it('The prefix should === "lang"', function(done) {
                assert.strictEqual(config({
                    prefix: "lang"
                }).prefix(), "lang");
                done();
            });



            it('The template should === "{{" && "}}"', function(done) {
                var template = config({
                    template: {
                        open: '{',
                        close: '}'
                    }
                }).template();

                assert.strictEqual(template.open, '{');
                assert.strictEqual(template.close, '}');
                done();
            });
        });


        describe('read external settings', function() {
            it('load the default settings', function(done) {
                assert.deepEqual(config().configuration(), require('../settings.json'));
                done();
            });

            it('load configured settings', function(done) {
                var _path = path.join(__dirname, 'configured.settings.json');
                var settings = config(_path);
                assert.notDeepEqual(settings.configuration(), require('../settings.json'));
                assert.deepEqual(settings.supported(), ['en-us', 'ja']);
                assert.deepEqual(settings.extension(), '.yml');
                done();
            });
        });

    });
});
