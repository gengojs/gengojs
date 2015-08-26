var semver = require('semver');
var version = new (require('node-version').version);
    version = version.getVersion();

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
    exec:{
      mocha: {
        cmd:function(version){
          console.log(version);
          if(semver.gt(version.toString(), '0.10.37')){
            return 'mocha test/index.js';
          } else return 'mocha --harmony test/harmony/index.js';
        }
      }
    }
  });
  grunt.registerTask('default', [
    'jsbeautifier',
    'jshint',
    'exec:mocha:' + version.long
  ]);

  grunt.registerTask('semicolon', ['jssemicoloned']);
};