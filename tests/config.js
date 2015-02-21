var config = require('../modules/config');
var mocha = require('mocha');
var assert = require('chai').assert;
var path = require('path');

describe('Begin configuration tests', function() {
    describe('Begin test with module "config"', function() {
        it('The default global identifier should === "__"', function(done) {
            assert.strictEqual(config().id(), "__");
            done();
        });

        it('The configured global identifier should === "_g"', function(done) {
            assert.strictEqual(config({
                global: '_g'
            }).id(), "_g");
            done();
        });

        it('The default directory should === "' + path.normalize(path.resolve('./locales')).replace(path.normalize('/tests'), '') + '" ',
            function(done) {
                assert.strictEqual(config().directory(), path.normalize(path.resolve('./locales')).replace(path.normalize('/tests'), ''));
                done();
            });

        it('The configured directory should === "' + path.normalize(path.resolve('./xfolder')).replace(path.normalize('/tests'), '') + '" ', function(done) {

            assert.strictEqual(config({
                directory: './xfolder'
            }).directory(), path.normalize(path.resolve('./xfolder')).replace(path.normalize('/tests'), ''));
            assert.strictEqual(config({
                directory: '/xfolder'
            }).directory(), path.normalize(path.resolve('./xfolder')).replace(path.normalize('/tests'), ''));
            done();
        });

        it('The default supported locales should === ["en-us"]', function(done) {
            assert.deepEqual(config().supported(), ['en-us']);
            done();
        });

        it('The configured supported locales should === ["en-us", "ja", "es"]', function(done) {
            assert.deepEqual(config({
                supported: ['en-US', 'ja', 'es']
            }).supported(), ['en-us', 'ja', 'es']);
            done();
        });

        it('The default locale should === "en-us"', function(done) {
            assert.strictEqual(config().default(), 'en-us');
            done();
        });

        it('The configured locale should === "ja"', function(done) {
            assert.strictEqual(config({
                default: 'ja'
            }).default(), 'ja');
            done();
        });

        it('The default router setting should === false', function(done) {
            assert.strictEqual(config().isRouter(), false);
            done();
        });

        it('The configured router setting should === true', function(done) {
            assert.strictEqual(config({
                router: true
            }).isRouter(), true);
            done();
        });

        it('The default markdown setting should === false', function(done) {
            assert.strictEqual(config().isMarkdown(), false);
            done();
        });

        it('The configured markdown setting should === true', function(done) {
            assert.strictEqual(config({
                markdown: true
            }).isMarkdown(), true);
            done();
        });

        it('The default extension should === "json"', function(done) {
            assert.strictEqual(config().extension(), '.json');
            done();
        });

        it('The configured extension should === "js"', function(done) {
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

        it('The default keywords should === "{default: "default",translated: "translated",universe: "gengo", plural: "plural"}"', function(done) {
            assert.deepEqual(config().keywords(), {
                default: 'default',
                translated: 'translated',
                universe: 'gengo',
                plural: 'plural'
            });
            done();
        });

        it('The configured keywords should === "{default: "a",translated: "b",universe: "c", plural: "d"}"', function(done) {
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

        it('The default prefix should === ""', function(done) {
            assert.strictEqual(config().prefix(), "");
            done();
        });

        it('The configured prefix should === "lang"', function(done) {
            assert.strictEqual(config({
                prefix: "lang"
            }).prefix(), "lang");
            done();
        });

        it('The default template should === "{{" && "}}"', function(done) {
            var template = config().template();
            assert.strictEqual(template.open, '{{');
            assert.strictEqual(template.close, '}}');
            done();
        });

        it('The configured template should === "{{" && "}}"', function(done) {
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
});
