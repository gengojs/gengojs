var root = require('app-root-path');
var path = require('path');
var gengo = require(path.normalize(root + '/express'));
var assert = require('chai').assert;
var request = require('supertest');
var Intl = require('intl');

describe('i18n - express', function() {
  describe('api', function() {
    describe('clone', function() {
      var express = require('express');
      var app = express();
      app.use(gengo({
        directory: root + '/tests/locales/unrouted/dest',
        supported: ['ja', 'en-us', 'en']
      }));
      
      describe('i18n', function() {
        var __ = gengo.clone().__;
        describe('request en-us', function() {
          it('should return "Hello"', function(done) {
            request(app).get('/').expect(function() {
              assert.strictEqual(__('Hello'), 'Hello');
            }).end(done);
          });
          describe('request en (override)', function() {
            it('should return "Hello!"', function(done) {
              request(app).get('/').expect(function() {
                assert.strictEqual(__('Hello', {
                  locale: 'en'
                }), 'Hello!');
              }).end(done);
            });
          });
        });
        describe('request ja', function() {
          it('should return "Hello"', function(done) {
            request(app).get('/').set('Accept-Language', 'ja').expect(function() {
              assert.strictEqual(__('Hello'), 'こんにちは');
            }).end(done);
          });
          describe('request en (override)', function() {
            it('should return "Hello!"', function(done) {
              request(app).get('/').set('Accept-Language', 'ja').expect(function() {
                assert.strictEqual(__('Hello', {
                  locale: 'en'
                }), 'Hello!');
              }).end(done);
            });
          });
        });
      });
      describe('localize', function() {
        var __l = gengo.clone().__l;
        describe('request en-us', function() {
          it('should return date in American English', function(done) {
            request(app).get('/').expect(function() {
              var options = {
                weekday: 'long',
                year: 'numeric',
                month: 'long',
                day: 'numeric'
              };
              assert.strictEqual(__l().date().format(new Date()), new Intl.DateTimeFormat('en-us', options).format(new Date()));
            }).end(done);
          });
        });

        describe('request ja', function() {
          it('should return date in Japanese', function(done) {
            request(app).get('/').set('Accept-Language', 'ja').expect(function() {
              var options = {
                weekday: 'long',
                year: 'numeric',
                month: 'long',
                day: 'numeric'
              };
              assert.strictEqual(__l().date().format(new Date()), new Intl.DateTimeFormat('ja', options).format(new Date()));
            }).end(done);
          });
        });
      });
      describe('locale', function() {
        var express = require('express');
        var app = express();
        app.use(gengo({
          directory: root + '/tests/locales/unrouted/dest',
          supported: ['ja', 'en-us', 'en']
        }));
        var __ = gengo.clone().__;
        describe('request en-us', function() {
          it('should return en-us', function(done) {
            request(app).get('/').expect(function() {
              assert.strictEqual(__.locale(), 'en-us');
            }).end(done);
          });
          describe('override', function() {
            it('should return ja', function(done) {
              request(app).get('/').expect(function() {
                __.locale('ja');
                assert.strictEqual(__.locale(), 'ja');
              }).end(done);
            });
          });
        });
      });
    });
  });

  describe('translate', function() {
    var express = require('express');
    var app = express();
    app.use(gengo({
      directory: root + '/tests/locales/unrouted/dest',
      supported: ['ja', 'en-us', 'en']
    }));

    app.get('/');
    var __ = gengo.clone().__;
    describe('phrase', function() {
      describe('request en-us', function() {
        it('should return "Hello"', function(done) {
          request(app).get('/').expect(function() {
            assert.strictEqual(__('Hello'), 'Hello');
          }).end(done);
        });
        it('should return "Hello Bob" with sprintf', function(done) {
          request(app).get('/').expect(function() {
            assert.strictEqual(__('Hello %s', 'Bob'), 'Hello Bob');
          }).end(done);
        });

        it('should return "Hello Bob" with interpolation', function(done) {
          request(app).get('/').expect(function() {
            assert.strictEqual(__('Hello {{name}}', {
              name: 'Bob'
            }), 'Hello Bob');
          }).end(done);
        });
        it('should return "Hello Bob, my name is George" with advanced sprintf', function(done) {
          request(app).get('/').expect(function() {
            assert.strictEqual(__('Hello %s, my name is %s', 'Bob', 'George'), 'Hello Bob, my name is George');
            assert.strictEqual(__('Hello %s, my name is %s', ['Bob', 'George']), 'Hello Bob, my name is George');
          }).end(done);
        });

        it('should return "Hello Bob, my name is George Curious" with advanced interpolation', function(done) {
          request(app).get('/').expect(function() {
            var phrase = __('Hello {{name}}, my name is {{my.firstname}} {{my.lastname}}', {
              name: 'Bob'
            }, {
              my: {
                firstname: 'George',
                lastname: 'Curious'
              }
            });
            assert.strictEqual(phrase, 'Hello Bob, my name is George Curious');
          }).end(done);
        });

      });
      describe('request ja', function() {
        it('should return "こんにちは"', function(done) {
          request(app).get('/').set('Accept-Language', 'ja').expect(function() {
            assert.strictEqual(__('Hello'), "こんにちは");
          }).end(done);
        });

        it('should return "こんにちはBobさん" with sprintf', function(done) {
          request(app).get('/').set('Accept-Language', 'ja').expect(function() {
            assert.strictEqual(__('Hello %s', 'Bob'), 'こんにちはBobさん');
          }).end(done);
        });

        it('should return "こんにちはBobさん" with interpolation', function(done) {
          request(app).get('/').set('Accept-Language', 'ja').expect(function() {
            assert.strictEqual(__('Hello {{name}}', {
              name: 'Bob'
            }), 'こんにちはBobさん');
          }).end(done);
        });
        it('should return "こんにちはBobさん、 私の名前はGeorgeです" with advanced sprintf', function(done) {
          request(app).get('/').set('Accept-Language', 'ja').expect(function() {
            assert.strictEqual(__('Hello %s, my name is %s', 'Bob', 'George'), 'こんにちはBobさん、 私の名前はGeorgeです');
            assert.strictEqual(__('Hello %s, my name is %s', ['Bob', 'George']), 'こんにちはBobさん、 私の名前はGeorgeです');
          }).end(done);
        });

        it('should return "こんにちはBobさん、 私の名前はGeorge Curiousです" with advanced interpolation', function(done) {
          request(app).get('/').set('Accept-Language', 'ja').expect(function() {
            var phrase = __('Hello {{name}}, my name is {{my.firstname}} {{my.lastname}}', {
              name: 'Bob'
            }, {
              my: {
                firstname: 'George',
                lastname: 'Curious'
              }
            });
            assert.strictEqual(phrase, 'こんにちはBobさん、 私の名前はGeorge Curiousです');
          }).end(done);
        });
      });
    });
    describe('bracket', function() {
      describe('request en-us', function() {
        it('should return "Hello"', function(done) {
          request(app).get('/').expect(function() {
            assert.strictEqual(__('[Hello]'), "Hello");
          }).end(done);
        });
        it('should return "Hey" with dot key', function(done) {
          request(app).get('/').expect(function() {
            assert.strictEqual(__('[greeting.informal.basic]'), 'Hey');
            assert.strictEqual(__('[greeting.informal.basic].default'), 'Hey');
          }).end(done);
        });
        it('should return "Hey" with advanced dot key', function(done) {
          request(app).get('/').expect(function() {
            assert.strictEqual(__('[greeting.informal.advanced].hey'), 'Hey');
            assert.strictEqual(__('[greeting.informal.advanced].hey.default'), 'Hey');
          }).end(done);
        });
      });

      describe('request ja', function() {
        it('should return "こんにちは"', function(done) {
          request(app).get('/').set('Accept-Language', 'ja').expect(function() {
            assert.strictEqual(__('[Hello]'), "こんにちは");
          }).end(done);
        });

        it('should return "おっす" with dot key', function(done) {
          request(app).get('/').set('Accept-Language', 'ja').expect(function() {
            assert.strictEqual(__('[greeting.informal.basic]'), 'おっす');
            assert.strictEqual(__('[greeting.informal.basic].translated'), 'おっす');
            assert.strictEqual(__('[greeting.informal.basic].default'), '');

          }).end(done);
        });
        it('should return "おっす" with advanced dot key', function(done) {
          request(app).get('/').set('Accept-Language', 'ja').expect(function() {
            assert.strictEqual(__('[greeting.informal.advanced].hey'), 'おっす');
            assert.strictEqual(__('[greeting.informal.advanced].hey.translated'), 'おっす');
            assert.strictEqual(__('[greeting.informal.advanced].hey.default'), '');
          }).end(done);
        });
      });
    });
    describe('dot', function() {
      describe('request en-us', function() {
        it('should return "Hey"', function(done) {
          request(app).get('/').expect(function() {
            assert.strictEqual(__('greeting.informal'), 'Hey');
          }).end(done);
        });
      });
      describe('request ja', function() {
        it('should return "おっす"', function(done) {
          request(app).get('/').set('Accept-Language', 'ja').expect(function() {
            assert.strictEqual(__('greeting.informal'), 'おっす');
          }).end(done);
        });
      });
    });
  });

  describe('plural', function() {
    var express = require('express');
    var app = express();
    app.use(gengo({
      directory: root + '/tests/locales/unrouted/dest',
      supported: ['ja', 'en-us', 'en']
    }));
    app.get('/');
    var __ = gengo.clone().__;
    describe('request en-us', function() {
      it('should return "There is one monkey in the tree"', function(done) {
        request(app).get('/').expect(function() {
          var tree = __('[There is one monkey in the {{tree}}]' + '.tree');
          var result = __('[There is one monkey in the {{tree}}]', {
            tree: tree
          }, {
            count: 1
          });
          assert.strictEqual(result, 'There is one monkey in the tree');
        }).end(done);
      });

      it('should return "There are 2 monkeys in the tree"', function(done) {
        request(app).get('/').expect(function() {
          var tree = __('[There is one monkey in the {{tree}}]' + '.tree');
          var result = __('[There is one monkey in the {{tree}}]', {
            tree: tree
          }, {
            count: 2
          });
          assert.strictEqual(result, 'There are 2 monkeys in the tree');
        }).end(done);
      });
    });

    describe('request ja', function() {
      it('should return "There is one monkey in the tree"', function(done) {
        request(app).get('/').set('Accept-Language', 'ja').expect(function() {
          var tree = __('[There is one monkey in the {{tree}}]' + '.tree');
          var result = __('[There is one monkey in the {{tree}}]', {
            tree: tree
          }, {
            count: 1
          });
          assert.strictEqual(result, '1匹のサルが木にいます。');
        }).end(done);
      });

      it('should return "There are 2 monkeys in the tree"', function(done) {
        request(app).get('/').set('Accept-Language', 'ja').expect(function() {
          var tree = __('[There is one monkey in the {{tree}}]' + '.tree');
          var result = __('[There is one monkey in the {{tree}}]', {
            tree: tree
          }, {
            count: 2
          });
          assert.strictEqual(result, '2匹のサルが木にいます。');
        }).end(done);
      });
    });
  });

  describe('route', function() {
    var express = require('express');
    var app = express();
    app.use(gengo({
      directory: root + '/tests/locales/routed/dest',
      supported: ['ja', 'en-us', 'en'],
      router: true
    }));
    app.get('/');
    app.get('/about');
    app.get('/api/v1.0/');
    app.get('/random');
    var __ = gengo.clone().__;
    describe('request en-us', function() {
      it('should return "Hello" at "/"', function(done) {
        request(app).get('/').expect(function() {
          assert.strictEqual(__('Hello'), 'Hello');
        }).end(done);
      });

      it('should return "Hello" at "/about"', function(done) {
        request(app).get('/about').expect(function() {
          assert.strictEqual(__('Hello'), 'Hello');
        }).end(done);
      });

      it('should return "Hello" at "/api/v1.0"', function(done) {
        request(app).get('/api/v1.0').expect(function() {
          assert.strictEqual(__('Hello'), 'Hello');
        }).end(done);
      });
      it('should return "Hello world!" at "/random"', function(done) {
        request(app).get('/random').expect(function() {
          assert.strictEqual(__('Hello world!'), 'Hello world!');
        }).end(done);
      });
    });

    describe('request ja', function() {
      it('should return "Hello" at "/"', function(done) {
        request(app).get('/').set('Accept-Language', 'ja').expect(function() {
          assert.strictEqual(__('Hello'), 'こんにちは');
        }).end(done);
      });

      it('should return "Hello" at "/about"', function(done) {
        request(app).get('/about').set('Accept-Language', 'ja').expect(function() {
          assert.strictEqual(__('Hello'), 'こんにちは');
        }).end(done);
      });

      it('should return "Hello" at "/api/v1.0"', function(done) {
        request(app).get('/api/v1.0').set('Accept-Language', 'ja').expect(function() {
          assert.strictEqual(__('Hello'), 'こんにちは');
        }).end(done);
      });
      it('should return "Hello world!" at "/random"', function(done) {
        request(app).get('/random').set('Accept-Language', 'ja').expect(function() {
          assert.strictEqual(__('Hello world!'), 'こんにちは！');
        }).end(done);
      });
    });
  });
});