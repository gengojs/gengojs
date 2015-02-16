var __ = require('../gengo');
var mocha = require('mocha');
var assert = require('assert');
describe('Begin input tests', function() {
    it('input __("hello") should == "hello"', function(done) {
        assert.strictEqual(__("hello").phrase, "hello");
        done();
    });

    it('input __({phrase:"hello"}) should === {phrase:"hello"}', function(done) {
        assert.deepEqual(__({
            phrase: "hello"
        }).phrase, {
            phrase: "hello"
        });
        done();
    });

    it('input __(["hello"]) should !== "hello"', function(done) {
        assert.notStrictEqual(__(["hello"]).phrase, "hello");
        done();
    });

    it('input __("hello", ["hello"]) should === "hello", ["hello"]', function(done) {
        var result = __('hello', ['hello']);
        assert.strictEqual(result.phrase, 'hello');
        assert.deepEqual(result.args, ['hello']);
        done();
    });

    it('input __("hello", {text:"hello"}) should === "hello", {text:"hello"}', function(done) {
        var result = __("hello", {
            text: "hello"
        });
        assert.strictEqual(result.phrase, "hello");
        assert.deepEqual(result.values, {
            text: "hello"
        })
        done();
    });

    it('input __("hello", {text:"hello"}) should have hasValues === true and hasArgs === false', function(done) {
        var result = __("hello", {
            text: "hello"
        });
        assert.strictEqual(result.extract.hasValues(), true);
        assert.strictEqual(result.extract.hasArgs(), false);
        done();
    });
});
