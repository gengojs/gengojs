module.exports = function(grunt) {
  require('load-grunt-tasks')(grunt);
  grunt.initConfig({
    jshint: {
      src: ['lib/**/*.js', 'parser/**/*.js', 'hapi/index.js', 'koa/index.js', 'modules/**/*.js', 'tests/**/*.js'],
      options: {
        jshintrc:'.jshintrc'
      }
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

      files: ['lib/**/*.js', 'parser/**/*.js', 'hapi/index.js', 'koa/index.js', 'modules/**/*.js', 'test/**/*.js']
    }
  });
  grunt.registerTask('default', [
    'jsbeautifier',
    'jshint'
  ]);

  grunt.registerTask('semicolon', ['jssemicoloned']);
};