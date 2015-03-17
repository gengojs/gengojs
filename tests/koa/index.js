var koa = require('koa'),
    app = koa(),
    gengo = require('../../koa/');
var path = require('path');
var jade = require('koa-jade-render');

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
var parser = require('../../parser/messageformat');

//gengo.use(parser());

app.use(gengo({
    directory: './tests/locales',
    supported: ['en-US', 'ja']
}));

app.use(jade(path.normalize(__dirname + '/')));


app.use(function*() {
    yield this.render('index');
});

app.listen(3000);
