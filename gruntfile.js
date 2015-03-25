module.exports = function(grunt) {
  require('load-grunt-tasks')(grunt);
  grunt.initConfig({
    stripJsonComments: {
      dist: {
        files: {
          "tests/locales/routed/dest/en-us.json": "tests/locales/routed/src/en-us.json",
          "tests/locales/routed/dest/ja.json": "tests/locales/routed/src/ja.json",
          "tests/locales/unrouted/dest/en-us.json": "tests/locales/unrouted/src/en-us.json",
          "tests/locales/unrouted/dest/en.json": "tests/locales/unrouted/src/en.json",
          "tests/locales/unrouted/dest/ja.json": "tests/locales/unrouted/src/ja.json"
        }
      }
    },
    jshint: {
      src: ['lib/**/*.js', 'parser/**/*.js', 'hapi/index.js', 'koa/index.js', 'modules/**/*.js', 'tests/**/*.js'],
      options: {
        jshintrc:'.jshintrc'
      }
    },
    'json-pretty': {
      options: {
        src: ['tests/locales/routed/dest/', 'tests/locales/unrouted/dest'],
        indent: 2
      },
    },
    "jsbeautifier": {
      "default": {
        src: ['index.js', 'parser/**/*.js', 'hapi/index.js', 'koa/index.js', 'modules/**/*.js']
      },
      options: {
        js: {
          braceStyle: "collapse",
          breakChainedMethods: false,
          e4x: false,
          evalCode: false,
          indentChar: " ",
          indentLevel: 0,
          indentSize: 2,
          indentWithTabs: false,
          jslintHappy: false,
          keepArrayIndentation: false,
          keepFunctionIndentation: false,
          maxPreserveNewlines: 10,
          preserveNewlines: true,
          spaceBeforeConditional: true,
          spaceInParen: false,
          unescapeStrings: false,
          wrapLineLength: 0,
          endWithNewline: true
        }
      }
    },
    jssemicoloned: {

      files: ['lib/**/*.js', 'parser/**/*.js', 'hapi/index.js', 'koa/index.js', 'modules/**/*.js', 'tests/**/*.js']
    }
  });
  grunt.registerTask('default', [
    'jsbeautifier',
    'jshint',
    'stripJsonComments',
    'json-pretty'
  ]);

  grunt.registerTask('semicolon', ['jssemicoloned']);
};