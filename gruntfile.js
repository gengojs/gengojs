module.exports = function(grunt) {
  require('load-grunt-tasks')(grunt);
  var sources = ['express/*.js', 'hapi/index.js', 'koa/index.js', 'modules/**/*.js', 'test/**/*.js'];
  grunt.initConfig({
    jshint: {
      src: sources,
      options: {
        jshintrc:'.jshintrc'
      }
    },
    "jsbeautifier": {
      "default": {
        src: sources
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
      files: sources
    },
    node_version:{
        options: {
        alwaysInstall: false,
        errorLevel: 'fatal',
        globals: [],
        maxBuffer: 200*1024,
        nvm: true,
        override: ''
      }
    },
    exec:{
      mocha: {
        cmd:'mocha test/'
      },
      mocha_harmony:{
        cmd:'mocha --harmony test/harmony/'
      }
    }
  });
  grunt.registerTask('default', [
    'jsbeautifier',
    'jshint',
    'exec:mocha',
    'exec:mocha_harmony'
  ]);

  grunt.registerTask('semicolon', ['jssemicoloned']);
};