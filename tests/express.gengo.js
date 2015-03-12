var express = require('express'),
    app = express(),
    gengo = require('../gengo.js');
var path = require('path');
/** 
 * Available Context API
 * =====================
 * 'this' is the context available to all parsers since
 * it was bound by the Gengo class to every parser.
 *
 * The context contains the following:
 * @class accept
 * @class config (with an alias as 'settings')
 * @class router
 * @class io
 * @property parser
 *
 * If you would like to attach something
 * to the context, please attach it to
 * the 'parser' property like so:
 * this.parser['name of parser'] = {
 *  'someKey':'someValue'
 * }
 */
var parser = require('../modules/parser/messageformat');

gengo.use(parser());

app.use(gengo({
    directory: './tests/locales',
    supported: ['en-US', 'ja']
}));

app.get('/', function(req, res, next) {
    res.send(req.__l('ja').datetime({
        weekday: 'long',
        year: 'numeric',
        month: 'long',
        day: 'numeric'
    }).format(new Date));
    next();
});

app.listen(3000);
