var router = require('express').Router();

router.get('/', function(req, res){
    res.render('index');
})

router.get('/about', function(req, res){
    res.render('about');
})

router.get('/contact', function(req, res){
    res.render('contact');
})

module.exports = router;