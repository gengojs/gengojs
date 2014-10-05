/*jslint node: true*/
/*global describe, before, it, after*/
var express = require('express'),
  gengo = new require('../gengo.js'),
  request = require('supertest'),
  assert = require('assert'),
  app = express(),
  server;

describe('Begin functionality test', function() {
  before(function(done) {
    gengo.config({
      default: 'en-US',
      supported: ['ja', 'en-US', 'en'],
      directory: '/tests/locales/',
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
    });
  });

  describe('Sprintf Tests', function() {
    describe('Sprintf string test using kawari.js with default being en-US', function() {
      it("Should use a phrase and print: これはkawari.jsテストです。", function(done) {
        request(app)
          .get('/')
          .set('Accept-Language', 'ja')
          .expect(200)
          .end(function(error, res) {
            if (error) {
              throw error;
            }
            assert.equal(gengo("This is a %s test.", "kawari.js"), "これはkawari.jsテストです。");
            done();
          });
      });

      it("Should use a phrase and print: This is a kawari.js test.", function(done) {
        request(app)
          .get('/')
          .set('Accept-Language', 'en_US')
          .expect(200)
          .end(function(error, res) {
            if (error) {
              throw error;
            }
            assert.equal(gengo("This is a %s test.", "kawari.js"), "This is a kawari.js test.");
            done();
          });
      });

      it("Should use a bracket notation and print: これはkawari.jsテストです。", function(done) {
        request(app)
          .get('/')
          .set('Accept-Language', 'ja')
          .expect(200)
          .end(function(error, res) {
            if (error) {
              throw error;
            }
            assert.equal(gengo("[bracket.test]", "kawari.js"), "これはkawari.jsテストです。");
            done();
          });
      });
      it("Should use a bracket notation and print: This is a kawari.js test.", function(done) {
        request(app)
          .get('/')
          .set('Accept-Language', 'en_US')
          .expect(200)
          .end(function(error, res) {
            if (error) {
              throw error;
            }
            assert.equal(gengo("[bracket.test]", "kawari.js"), "This is a kawari.js test.");
            done();
          });
      });

      it("Should use a dot notation and print: これはkawari.jsテストです。", function(done) {
        request(app)
          .get('/')
          .set('Accept-Language', 'ja')
          .expect(200)
          .end(function(error, res) {
            if (error) {
              throw error;
            }
            assert.equal(gengo("dot.test", "kawari.js"), "これはkawari.jsテストです。");
            done();
          });
      });
      it("Should use a dot notation and print: This is a kawari.js test.", function(done) {
        request(app)
          .get('/')
          .set('Accept-Language', 'en_US')
          .expect(200)
          .end(function(error, res) {
            if (error) {
              throw error;
            }
            assert.equal(gengo("dot.test", "kawari.js"), "This is a kawari.js test.");
            done();
          });
      });

      it("Should use a object notation and print: これはkawari.jsテストです。", function(done) {
        request(app)
          .get('/')
          .set('Accept-Language', 'ja')
          .expect(200)
          .end(function(error, res) {
            if (error) {
              throw error;
            }
            assert.equal(gengo({
              phrase: "dot.test"
            }, "kawari.js"), "これはkawari.jsテストです。");
            done();
          });
      });
      it("Should use a object notation and print: This is a kawari.js test.", function(done) {
        request(app)
          .get('/')
          .set('Accept-Language', 'en_US')
          .expect(200)
          .end(function(error, res) {
            if (error) {
              throw error;
            }
            assert.equal(gengo({
              phrase: "dot.test"
            }, "kawari.js"), "This is a kawari.js test.");
            done();
          });
      });
    });

    describe('Sprintf array test using kawari.js with default being en-US', function() {
      it("Should use a phrase and print: これはkawari.jsテストです。", function(done) {
        request(app)
          .get('/')
          .set('Accept-Language', 'ja')
          .expect(200)
          .end(function(error, res) {
            if (error) {
              throw error;
            }
            assert.equal(gengo("This is a %s test.", ["kawari.js"]), "これはkawari.jsテストです。");
            done();
          });
      });

      it("Should use a phrase and print: This is a kawari.js test.", function(done) {
        request(app)
          .get('/')
          .set('Accept-Language', 'en_US')
          .expect(200)
          .end(function(error, res) {
            if (error) {
              throw error;
            }
            assert.equal(gengo("This is a %s test.", ["kawari.js"]), "This is a kawari.js test.");
            done();
          });
      });

      it("Should use a bracket notation and print: これはkawari.jsテストです。", function(done) {
        request(app)
          .get('/')
          .set('Accept-Language', 'ja')
          .expect(200)
          .end(function(error, res) {
            if (error) {
              throw error;
            }
            assert.equal(gengo("[bracket.test]", ["kawari.js"]), "これはkawari.jsテストです。");
            done();
          });
      });
      it("Should use a bracket notation and print: This is a kawari.js test.", function(done) {
        request(app)
          .get('/')
          .set('Accept-Language', 'en_US')
          .expect(200)
          .end(function(error, res) {
            if (error) {
              throw error;
            }
            assert.equal(gengo("[bracket.test]", ["kawari.js"]), "This is a kawari.js test.");
            done();
          });
      });

      it("Should use a dot notation and print: これはkawari.jsテストです。", function(done) {
        request(app)
          .get('/')
          .set('Accept-Language', 'ja')
          .expect(200)
          .end(function(error, res) {
            if (error) {
              throw error;
            }
            assert.equal(gengo("dot.test", ["kawari.js"]), "これはkawari.jsテストです。");
            done();
          });
      });
      it("Should use a dot notation and print: This is a kawari.js test.", function(done) {
        request(app)
          .get('/')
          .set('Accept-Language', 'en_US')
          .expect(200)
          .end(function(error, res) {
            if (error) {
              throw error;
            }
            assert.equal(gengo("dot.test", ["kawari.js"]), "This is a kawari.js test.");
            done();
          });
      });

      it("Should use a object notation and print: これはkawari.jsテストです。", function(done) {
        request(app)
          .get('/')
          .set('Accept-Language', 'ja')
          .expect(200)
          .end(function(error, res) {
            if (error) {
              throw error;
            }
            assert.equal(gengo({
              phrase: "dot.test"
            }, ["kawari.js"]), "これはkawari.jsテストです。");
            done();
          });
      });
      it("Should use a object notation and print: This is a kawari.js test.", function(done) {
        request(app)
          .get('/')
          .set('Accept-Language', 'en_US')
          .expect(200)
          .end(function(error, res) {
            if (error) {
              throw error;
            }
            assert.equal(gengo({
              phrase: "dot.test"
            }, ["kawari.js"]), "This is a kawari.js test.");
            done();
          });
      });
    });

    describe('Sprintf object test using kawari.js with default being en-US', function() {
      it("Should use a phrase and print: これはkawari.jsテストです。", function(done) {
        request(app)
          .get('/')
          .set('Accept-Language', 'ja')
          .expect(200)
          .end(function(error, res) {
            if (error) {
              throw error;
            }
            assert.equal(gengo("This is a %s test.", {
              sprintf: "kawari.js"
            }), "これはkawari.jsテストです。");
            done();
          });
      });

      it("Should use a phrase and print: This is a kawari.js test.", function(done) {
        request(app)
          .get('/')
          .set('Accept-Language', 'en_US')
          .expect(200)
          .end(function(error, res) {
            if (error) {
              throw error;
            }
            assert.equal(gengo("This is a %s test.", {
              sprintf: "kawari.js"
            }), "This is a kawari.js test.");
            done();
          });
      });

      it("Should use a bracket notation and print: これはkawari.jsテストです。", function(done) {
        request(app)
          .get('/')
          .set('Accept-Language', 'ja')
          .expect(200)
          .end(function(error, res) {
            if (error) {
              throw error;
            }
            assert.equal(gengo("[bracket.test]", {
              sprintf: "kawari.js"
            }), "これはkawari.jsテストです。");
            done();
          });
      });
      it("Should use a bracket notation and print: This is a kawari.js test.", function(done) {
        request(app)
          .get('/')
          .set('Accept-Language', 'en_US')
          .expect(200)
          .end(function(error, res) {
            if (error) {
              throw error;
            }
            assert.equal(gengo("[bracket.test]", {
              sprintf: "kawari.js"
            }), "This is a kawari.js test.");
            done();
          });
      });

      it("Should use a dot notation and print: これはkawari.jsテストです。", function(done) {
        request(app)
          .get('/')
          .set('Accept-Language', 'ja')
          .expect(200)
          .end(function(error, res) {
            if (error) {
              throw error;
            }
            assert.equal(gengo("dot.test", {
              sprintf: "kawari.js"
            }), "これはkawari.jsテストです。");
            done();
          });
      });
      it("Should use a dot notation and print: This is a kawari.js test.", function(done) {
        request(app)
          .get('/')
          .set('Accept-Language', 'en_US')
          .expect(200)
          .end(function(error, res) {
            if (error) {
              throw error;
            }
            assert.equal(gengo("dot.test", {
              sprintf: "kawari.js"
            }), "This is a kawari.js test.");
            done();
          });
      });

      it("Should use a object notation and print: これはkawari.jsテストです。", function(done) {
        request(app)
          .get('/')
          .set('Accept-Language', 'ja')
          .expect(200)
          .end(function(error, res) {
            if (error) {
              throw error;
            }
            assert.equal(gengo({
              phrase: "dot.test"
            }, {
              sprintf: "kawari.js"
            }), "これはkawari.jsテストです。");
            done();
          });
      });
      it("Should use a object notation and print: This is a kawari.js test.", function(done) {
        request(app)
          .get('/')
          .set('Accept-Language', 'en_US')
          .expect(200)
          .end(function(error, res) {
            if (error) {
              throw error;
            }
            assert.equal(gengo({
              phrase: "dot.test"
            }, {
              sprintf: "kawari.js"
            }), "This is a kawari.js test.");
            done();
          });
      });
    });
  });

  describe('Mustache Tests', function() {
    describe('Mustache syntax test  using Mustache.js with default being en-US', function() {
      it("Should use Mustache syntax in a phrase and print: gengo.jsへようこそ。", function(done) {
        request(app)
          .get('/')
          .set('Accept-Language', 'ja')
          .expect(200)
          .end(function(error, res) {
            if (error) {
              throw error;
            }
            assert.equal(gengo("Welcome to {{gengo}}.", {
              gengo: 'gengo.js'
            }), "gengo.jsへようこそ。");
            done();
          });
      });

      it("Should use Mustache syntax in a phrase and print: Welcome to gengo.js.", function(done) {
        request(app)
          .get('/')
          .set('Accept-Language', 'en_US')
          .expect(200)
          .end(function(error, res) {
            if (error) {
              throw error;
            }
            assert.equal(gengo("Welcome to {{gengo}}.", {
              gengo: 'gengo.js'
            }), "Welcome to gengo.js.");
            done();
          });
      });

      it("Should use Mustache syntax in a bracket notation and print: gengo.jsへようこそ。", function(done) {
        request(app)
          .get('/')
          .set('Accept-Language', 'ja')
          .expect(200)
          .end(function(error, res) {
            if (error) {
              throw error;
            }
            assert.equal(gengo("[bracket.test].mustache", {
              gengo: 'gengo.js'
            }), "gengo.jsへようこそ。");
            done();
          });
      });

      it("Should use Mustache syntax in a bracket notation and print: Welcome to gengo.js.", function(done) {
        request(app)
          .get('/')
          .set('Accept-Language', 'en_US')
          .expect(200)
          .end(function(error, res) {
            if (error) {
              throw error;
            }
            assert.equal(gengo("[bracket.test].mustache", {
              gengo: 'gengo.js'
            }), "Welcome to gengo.js.");
            done();
          });
      });

      it("Should use Mustache syntax in a dot notation and print: gengo.jsへようこそ。", function(done) {
        request(app)
          .get('/')
          .set('Accept-Language', 'ja')
          .expect(200)
          .end(function(error, res) {
            if (error) {
              throw error;
            }
            assert.equal(gengo("dot.mustache", {
              gengo: 'gengo.js'
            }), "gengo.jsへようこそ。");
            done();
          });
      });

      it("Should use Mustache syntax in a dot notation and print: Welcome to gengo.js.", function(done) {
        request(app)
          .get('/')
          .set('Accept-Language', 'en_US')
          .expect(200)
          .end(function(error, res) {
            if (error) {
              throw error;
            }
            assert.equal(gengo("dot.mustache", {
              gengo: 'gengo.js'
            }), "Welcome to gengo.js.");
            done();
          });
      });


    });
  });
  describe("Function test", function() {
    describe("langauge()", function() {
      it("Should return Japanese", function(done) {
        request(app)
          .get('/')
          .set('Accept-Language', 'ja')
          .expect(200)
          .end(function(error, res) {
            if (error) {
              throw error;
            }
            assert.equal(gengo.language(), "Japanese");
            done();
          });
      });

      it("Should return English", function(done) {
        request(app)
          .get('/')
          .set('Accept-Language', 'en')
          .expect(200)
          .end(function(error, res) {
            if (error) {
              throw error;
            }
            assert.equal(gengo.language(), "English");
            done();

          });
      });

      it("Should return English US", function(done) {
        request(app)
          .get('/')
          .set('Accept-Language', 'en_US')
          .expect(200)
          .end(function(error, res) {
            if (error) {
              throw error;
            }
            assert.equal(gengo.language(), "English US");
            done();
          });
      });
    });
    describe("getLocale()", function() {
      it("Should return Japanese", function(done) {
        request(app)
          .get('/')
          .set('Accept-Language', 'ja')
          .expect(200)
          .end(function(error, res) {
            if (error) {
              throw error;
            }
            assert.equal(gengo.getLocale(), "ja");
            done();
          });
      });

      it("Should return English", function(done) {
        request(app)
          .get('/')
          .set('Accept-Language', 'en')
          .expect(200)
          .end(function(error, res) {
            if (error) {
              throw error;
            }
            assert.equal(gengo.getLocale(), "en");
            done();

          });
      });

      it("Should return English US", function(done) {
        request(app)
          .get('/')
          .set('Accept-Language', 'en_US')
          .expect(200)
          .end(function(error, res) {
            if (error) {
              throw error;
            }
            assert.equal(gengo.getLocale(), "en-US");
            done();
          });
      });
    });
    describe("setLocale()", function() {
      it("Should return en-US with locale set to en-us an Accept-Language to ja", function(done) {
        request(app)
          .get('/')
          .set('Accept-Language', 'ja')
          .expect(200)
          .end(function(error, res) {
            if (error) {
              throw error;
            }
            gengo.setLocale('en-us');
            assert.equal(gengo.getLocale(), "en-US");
            done();
          });
      });

      it("Should return ja with locale set to ja an Accept-Language to en", function(done) {
        request(app)
          .get('/')
          .set('Accept-Language', 'en')
          .expect(200)
          .end(function(error, res) {
            if (error) {
              throw error;
            }
            gengo.setLocale('ja');
            assert.equal(gengo.getLocale(), "ja");
            done();

          });
      });

      it("Should return en with locale set to en an Accept-Language to en_US", function(done) {
        request(app)
          .get('/')
          .set('Accept-Language', 'en_US')
          .expect(200)
          .end(function(error, res) {
            if (error) {
              throw error;
            }
            gengo.setLocale('en');
            assert.equal(gengo.getLocale(), "en");
            done();
          });
      });
    });

  });


  after(function(done) {
    server.close();
    done();
  });
});
