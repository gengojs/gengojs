var __ = require('../gengo');
var mocha = require('mocha');
var assert = require('assert');
describe('Begin input tests', function() {
    it('input __("hello") should equal to "hello"', function(done) {
        assert.equal(__("hello").phrase, "hello");
        done();
    });

    it('input __({phrase:"hello"}) should equal to {phrase:"hello"}', function(done) {
        assert.deepEqual(__({
            phrase: "hello"
        }).phrase, {
            phrase: "hello"
        });
        done();
    });

    it('input __(["hello"]) should not equal to "hello"', function(done) {
        assert.notEqual(__(["hello"]).phrase, "hello");
        done();
    });

    it('input __("hello", ["hello"]) should equal to "hello", ["hello"]', function(done) {
        var result = __('hello', ['hello']);
        assert.equal(result.phrase, 'hello');
        assert.deepEqual(result.args, ['hello']);
        done();
    });

    it('input __("hello", {text:"hello"}) should equal to "hello", {text:"hello"}', function(done) {
        var result = __("hello", {
            text: "hello"
        });
        assert.equal(result.phrase, "hello");
        assert.deepEqual(result.values, {
            text: "hello"
        })
        done();
    });
});
