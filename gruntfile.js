module.exports = function(grunt) {
    require('load-grunt-tasks')(grunt);
    grunt.initConfig({
        stripJsonComments: {
            dist: {
                files: {
                    "tests/locales/routed/dest/en-us.json": "tests/locales/routed/src/en-us.json",
                    "tests/locales/routed/dest/ja.json": "tests/locales/routed/src/ja.json",
                    "tests/locales/unrouted/dest/en-us.json": "tests/locales/unrouted/src/en-us.json",
                    "tests/locales/unrouted/dest/ja.json": "tests/locales/unrouted/src/ja.json"
                }
            }
        },
        jshint: {
            src: ['index.js', 'parser/**/*.js', 'hapi/index.js', 'koa/index.js', 'modules/**/*.js'],
            options: {
                esnext: true
            }
        },
        'json-pretty': {
            options: {
                src: ['tests/locales/routed/dest/', 'tests/locales/unrouted/dest'],
                indent: 4
            },
        }
    });
    grunt.registerTask('default', ['jshint', 'stripJsonComments', 'json-pretty']);
};