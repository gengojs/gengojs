var __ = require('../gengo').__mock;
var mocha = require('mocha');
var assert = require('chai').assert;
describe('Begin input functionality tests without translations', function() {
    describe('Begin tests with one argument', function() {
        describe('String', function() {
            it('input __("hello") should === "hello"', function(done) {
                assert.strictEqual(__('hello').phrase, 'hello');
                done();
            });
        });

        describe('Object', function() {
            it('input __({phrase:"hello"}) should === "hello"', function(done) {
                assert.strictEqual(__({
                    phrase: 'hello'
                }).phrase, 'hello');
                done();
            });

            it('input __({phrase:"hello", locale: "ja", sprintf:["world"], count:2, x:"!"}) should === "hello"', function(done) {
                var result = __({
                    phrase: 'hello',
                    locale: "ja",
                    sprintf: ["world"],
                    count: 2,
                    x: "!"
                });
                assert.strictEqual(result.phrase, 'hello');
                assert.deepEqual(result.values, {
                    locale: 'ja',
                    count: 2,
                });
                assert.deepEqual(result.args, ['world']);
                assert.deepEqual(result.template, {
                    x: '!'
                });
                done();
            });
        });

        describe('Array', function() {
            it('input __(["hello"]) should !== "hello"', function(done) {
                assert.notStrictEqual(__(['hello']).phrase, 'hello');
                done();
            });
        });

        describe('Number', function() {
            it('input __(2) should !== "hello"', function(done) {
                assert.notStrictEqual(__(2).phrase, 'hello');
                done();
            });
        });
    });

    describe('Begin tests with two arguments', function() {
        describe('String', function() {
            it('input __("hello", "world") should === "hello" &&  === ["world"]', function(done) {
                var result = __('hello', 'world');
                assert.strictEqual(result.phrase, 'hello');
                assert.deepEqual(result.args, ['world']);
                done();
            });

            it('input __("hello", {phrase:"world"}) should === "hello" && === {}', function(done) {
                var result = __('hello', {
                    phrase: 'world'
                });
                assert.strictEqual(result.phrase, 'hello');
                assert.notStrictEqual(result.phrase, 'world');
                assert.deepEqual(result.values, {});
                done();
            });

            it('input __("hello", {locale:"ja"}) should  === "hello" && === {locale:"ja"}', function(done) {
                var result = __('hello', {
                    locale: 'ja'
                });
                assert.strictEqual(result.phrase, 'hello');
                assert.deepEqual(result.values, {
                    locale: 'ja'
                });
                done();
            });

            it('input __("hello", {sprintf:"world"}) should === "hello" && === ["world"]', function(done) {
                var result = __('hello', {
                    sprintf: 'world'
                });
                assert.strictEqual(result.phrase, 'hello');
                assert.notStrictEqual(result.values, 'world');
                assert.notStrictEqual(result.values, {
                    sprintf: 'world'
                });
                assert.deepEqual(result.args, ['world']);
                done();
            });

            it('input __("hello", {count:2}) should === "hello" && === {count:2}', function(done) {
                var result = __('hello', {
                    count: 2
                });
                assert.strictEqual(result.phrase, 'hello');
                assert.deepEqual(result.values, {
                    count: 2
                });
                done();
            });

            it('input __("hello", ["world"]) should === "hello" && === ["world"]', function(done) {
                var result = __('hello', ['world']);
                assert.strictEqual(result.phrase, 'hello');
                assert.deepEqual(result.args, ['world']);
                done();
            });

            it('input __("hello", [{"world"}]) should === "hello" && === []', function(done) {
                var result = __('hello', [{
                    phrase: 'world'
                }]);
                assert.strictEqual(result.phrase, 'hello');
                assert.notDeepEqual(result.args, ['world']);
                assert.deepEqual(result.args, []);
                done();
            });

            it('input __("hello", ["world", 2, "!"]) should === "hello" && === ["world", 2, "!"]', function(done) {
                var result = __('hello', ['world', 2, '!']);
                assert.strictEqual(result.phrase, 'hello');
                assert.deepEqual(result.args, ['world', 2, '!']);
                done();
            });

            it('input __("hello", 2) should === "hello" && === [2]', function(done) {
                var result = __('hello', 2);
                assert.strictEqual(result.phrase, 'hello');
                assert.deepEqual(result.args, [2]);
                done();
            });
        });

        describe('Object', function() {
            it('input __({phrase:"hello"}, "world") should === "hello" && === ["world"]', function(done) {
                var result = __({
                    phrase: 'hello'
                }, 'world');
                assert.strictEqual(result.phrase, 'hello');
                assert.deepEqual(result.args, ['world']);
                done();
            });

            it('input __({phrase:"hello"}, {phrase:"world"}) should === "hello" && === ["world"]', function(done) {
                var result = __({
                    phrase: 'hello'
                }, {
                    phrase: 'world'
                });
                assert.strictEqual(result.phrase, 'hello');
                assert.deepEqual(result.values, {});
                done();
            });

            it('input __({phrase:"hello"}, {locale:"ja"}) should === "hello" && === ["world"]', function(done) {
                var result = __({
                    phrase: 'hello'
                }, {
                    locale: 'ja'
                });
                assert.strictEqual(result.phrase, 'hello');
                assert.deepEqual(result.values, {
                    locale: 'ja'
                });
                done();
            });

            it('input __({phrase:"hello"}, {locale:"ja", x:"world"}) should === "hello" && === {locale:"ja"} && === {x:"world"}', function(done) {
                var result = __({
                    phrase: 'hello'
                }, {
                    locale: 'ja',
                    x: 'world'
                });
                assert.strictEqual(result.phrase, 'hello');
                assert.deepEqual(result.values, {
                    locale: 'ja'
                });

                assert.deepEqual(result.template, {
                    x: 'world'
                });
                done();
            });

            it('input __({phrase:"hello"}, {locale:"ja", x:"world", sprintf:["!"]}) should === "hello" && === {locale:"ja"} && === {x:"world"} && === ["!"]', function(done) {
                var result = __({
                    phrase: 'hello'
                }, {
                    locale: 'ja',
                    x: 'world',
                    sprintf: '!'
                });

                assert.strictEqual(result.phrase, 'hello');
                assert.deepEqual(result.values, {
                    locale: 'ja'
                });
                assert.deepEqual(result.args, ['!']);
                assert.deepEqual(result.template, {
                    x: 'world'
                });
                done();
            });

            it('input __({phrase:"hello"}, {count:2, x:"world", sprintf:["!"]}) should === "hello" && === {count: 2} && === {x:"world"} && === ["!"]', function(done) {
                var result = __({
                    phrase: 'hello'
                }, {
                    count: 2,
                    x: 'world',
                    sprintf: '!'
                });

                assert.strictEqual(result.phrase, 'hello');
                assert.deepEqual(result.values, {
                    count: 2
                });
                assert.deepEqual(result.args, ['!']);
                assert.deepEqual(result.template, {
                    x: 'world'
                });
                done();
            });

            it('input __({phrase:"hello"}, ["world"]) should === "hello" && === ["world"]', function(done) {
                var result = __({
                    phrase: 'hello'
                }, ['world']);
                assert.strictEqual(result.phrase, 'hello');
                assert.deepEqual(result.args, ['world']);
                done();
            });

            it('input __({phrase:"hello"}, ["world", {locale:"world"}]) should === "hello" && === ["world"]', function(done) {
                var result = __({
                    phrase: 'hello'
                }, ['world', {
                    locale: 'world'
                }]);
                assert.strictEqual(result.phrase, 'hello');
                assert.deepEqual(result.args, ['world']);
                assert.notDeepEqual(result.values, {
                    locale: 'world'
                });
                done();
            });

        });

        describe('Array', function() {
            it('input __(["hello"], "world") should !== "hello"', function(done) {
                var result = __(['hello'], 'world');
                assert.notStrictEqual(result.phrase, 'hello');
                done();
            });
        });

        describe('Number', function() {
            it('input __(2, "world") should !== "hello"', function(done) {
                var result = __(2, 'world');
                assert.notStrictEqual(result.phrase, 'hello');
                done();
            });
        });
    });

    describe('Begin tests with n arguments', function() {
        describe('String', function() {
            it('input __("hello", "world", "!") should === "hello" &&  === ["world", "!"]', function(done) {
                var result = __('hello', 'world', '!');
                assert.strictEqual(result.phrase, 'hello');
                assert.deepEqual(result.args, ['world', '!']);
                done();
            });

            it('input __("hello", "world", "!", 2) should === "hello" &&  === ["world", "!", 2]', function(done) {
                var result = __('hello', 'world', '!', 2);
                assert.strictEqual(result.phrase, 'hello');
                assert.deepEqual(result.args, ['world', '!', 2]);
                done();
            });

            it('input __("hello", "world", {phrase:"goodbye"}) should === "hello" &&  === ["world"]', function(done) {
                var result = __('hello', 'world', {
                    phrase: 'goodbye'
                });
                assert.strictEqual(result.phrase, 'hello');
                assert.deepEqual(result.args, ['world']);
                assert.deepEqual(result.values, {});
                done();
            });

            it('input __("hello", "world", {phrase:"goodbye", locale:"ja"}) should === "hello" &&  === ["world"] && === {locale:"ja"}', function(done) {
                var result = __('hello', 'world', {
                    phrase: 'goodbye',
                    locale: "ja"
                });
                assert.strictEqual(result.phrase, 'hello');
                assert.deepEqual(result.args, ['world']);
                assert.deepEqual(result.values, {
                    locale: 'ja'
                });
                done();
            });

            it('input __("hello", "world", {phrase:"goodbye"}, {locale:"ja"}) should === "hello" &&  === ["world"] && === {locale:"ja"}', function(done) {
                var result = __('hello', 'world', {
                    phrase: 'goodbye'
                }, {
                    locale: "ja"
                });
                assert.strictEqual(result.phrase, 'hello');
                assert.deepEqual(result.args, ['world']);
                assert.deepEqual(result.values, {
                    locale: 'ja'
                });
                done();
            });

            it('input __("hello", "world", {phrase:"goodbye"}, {locale:"ja"} ,{x:"!"}) should === "hello" &&  === ["world"] && === {locale:"ja"} && === {x:"!"}', function(done) {
                var result = __('hello', 'world', {
                    phrase: 'goodbye'
                }, {
                    locale: "ja"
                }, {
                    x: "!"
                });
                assert.strictEqual(result.phrase, 'hello');
                assert.deepEqual(result.args, ['world']);
                assert.deepEqual(result.values, {
                    locale: 'ja'
                });
                assert.deepEqual(result.template, {
                    x: "!"
                });
                done();
            });

            it('input __("hello", "world", {count:2}, {locale:"ja"} , {x:"!"}) should === "hello" &&  === ["world"] && === {locale:"ja", count:2} && === {x:"!"}', function(done) {
                var result = __('hello', 'world', {
                    count: 2
                }, {
                    locale: "ja"
                }, {
                    x: "!"
                });
                assert.strictEqual(result.phrase, 'hello');
                assert.deepEqual(result.args, ['world']);
                assert.deepEqual(result.values, {
                    locale: 'ja',
                    count: 2
                });
                assert.deepEqual(result.template, {
                    x: "!"
                });
                done();
            });

            it('input __("hello", "world", {locale:"ja"}, ["cake"], {x:"!"}) should === "hello" &&  === ["world","cake"] && === {locale:"ja"} && === {x:"!"}', function(done) {
                var result = __('hello', 'world', ['cake'], {
                    locale: "ja"
                }, {
                    x: "!"
                });
                assert.strictEqual(result.phrase, 'hello');
                assert.deepEqual(result.args, ['world', 'cake']);
                assert.deepEqual(result.values, {
                    locale: 'ja'
                });
                assert.deepEqual(result.template, {
                    x: "!"
                });
                done();
            });

            it('input __("hello", "world",["!", {locale:"ja"}]) should === "hello" &&  === ["world", "!"]', function(done) {
                var result = __('hello', 'world', ['!', {
                    locale: 'ja'
                }]);
                assert.strictEqual(result.phrase, 'hello');
                assert.deepEqual(result.args, ['world', '!']);
                done();
            });
        });

        describe('Object', function() {
            it('input __({phrase:"hello"}, "world", "!") should === "hello" && === ["world"]', function(done) {
                var result = __({
                    phrase: 'hello'
                }, 'world', '!');
                assert.strictEqual(result.phrase, 'hello');
                assert.deepEqual(result.args, ['world', '!']);
                done();
            });

            it('input __({phrase:"hello"}, "world", {phrase:"!"}) should === "hello" && === ["world"]', function(done) {
                var result = __({
                    phrase: 'hello'
                }, 'world', {
                    phrase: '!'
                });
                assert.strictEqual(result.phrase, 'hello');
                assert.deepEqual(result.args, ['world']);
                done();
            });

            it('input __({phrase:"hello"}, "world", {locale:"ja"}) should === "hello" && === ["world"] && === {locale:"ja"}', function(done) {
                var result = __({
                    phrase: 'hello'
                }, 'world', {
                    locale: 'ja'
                });
                assert.strictEqual(result.phrase, 'hello');
                assert.deepEqual(result.args, ['world']);
                assert.deepEqual(result.values, {
                    locale: 'ja'
                });
                done();
            });

            it('input __({phrase:"hello", locale:"en"}, "world", {locale:"ja"}) should === "hello" && === ["world"] && === {locale:"en"}', function(done) {
                var result = __({
                    phrase: 'hello',
                    locale: 'en'
                }, 'world', {
                    locale: 'ja'
                });
                assert.strictEqual(result.phrase, 'hello');
                assert.deepEqual(result.args, ['world']);
                assert.deepEqual(result.values, {
                    locale: 'en'
                });
                done();
            });

            it('input __({phrase:"hello", count:"2"}, "world", {count:3}) should === "hello" && === ["world"] && === {count:2}', function(done) {
                var result = __({
                    phrase: 'hello',
                    count: 2
                }, 'world', {
                    count: 3
                });
                assert.strictEqual(result.phrase, 'hello');
                assert.deepEqual(result.args, ['world']);
                assert.deepEqual(result.values, {
                    count: 2
                });
                done();
            });

            it('input __({phrase:"hello", count:"2"}, "world", {count:3}, ["!"], 2) should === "hello" && === ["world", "!", 2] && === {count:2}', function(done) {
                var result = __({
                    phrase: 'hello',
                    count: 2
                }, 'world', {
                    count: 3
                }, ["!"], 2);
                assert.strictEqual(result.phrase, 'hello');
                assert.deepEqual(result.args, ['world', '!', 2]);
                assert.deepEqual(result.values, {
                    count: 2
                });
                done();
            });
        });

        describe('Array', function() {
            it('input __(["hello"], "world", {locale:"ja"}) should !== "hello"', function(done) {
                var result = __(['hello'], 'world', {
                    locale: 'ja'
                });
                assert.notStrictEqual(result.phrase, 'hello');
                done();
            });
        });

        describe('Number', function() {
            it('input __(2, "world", {locale:"ja"}) should !== "hello"', function(done) {
                var result = __(2, 'world', {
                    locale: 'ja'
                });
                assert.notStrictEqual(result.phrase, 'hello');
                done();
            });
        });
    });


});
