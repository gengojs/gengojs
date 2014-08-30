var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res) {
    res.render('index', {
        title: 'エクスプレス',
        name: 'John Doe'
    });
});

router.get('/about', function(req, res) {
    res.render('about');
});

module.exports = router;
