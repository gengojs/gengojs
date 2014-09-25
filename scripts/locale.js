/*jslint node: true*/
/*global cat, echo*/
require('shelljs/global');

var colors = require('colors'),
    prompt = require('prompt'),
    approot = require('app-root-path');

colors.setTheme({
    silly: 'rainbow',
    input: 'grey',
    verbose: 'cyan',
    prompt: 'grey',
    info: 'green',
    data: 'grey',
    help: 'cyan',
    warn: 'yellow',
    debug: 'blue',
    error: 'red'
});

prompt.start();
var dir = "./scripts/dir.txt",
    template = "./scripts/template.txt",
    path;
if (!cat(dir)) {
    echo("Uh oh, I don't know where to look at.\n ".warn);
    echo(("Could you tell me where your locales are located in \n" + approot + "/").info);
    prompt.get(["path"], function(error, result) {
        if (error) {
            echo("\nUh oh, something went wrong there. Try running the script again.".error);
        } else {
            var tempPath = result.path;
            if (tempPath.indexOf('/') === 0) {
                tempPath = tempPath.replace("/", "");
            }
            if (tempPath.slice(-1) !== '/') {
                tempPath = tempPath + '/';
            }

            path = tempPath;
            (approot + "/" + path).to(dir);
        }
        if (cat(dir)) {
            echo('Path saved!'.info);
        }
    });
} else {
    echo('What is the locale of the file you want to create?'.info);
    echo('Examples: en_US, en, etc.'.help);
    prompt.get(['locale'], function(error, result) {
        if (error) {
            echo("\nUh oh, something went wrong there. Try running the script again.".error);
        } else {
            (cat(template)).to(cat(dir) + result.locale + ".js");
        }
    });
}
