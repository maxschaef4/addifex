var router = require('express').Router();
var Product = require('../models/product');

router.get('/', function(req, res){
    Product.find({}, function(err, result){
        res.render('index', {product: result});
    })
})

router.get('/about', function(req, res){
    res.render('about');
})

router.get('/contact', function(req, res){
    res.render('contact');
})

module.exports = router;