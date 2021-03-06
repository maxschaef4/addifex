var router = require('express').Router();
var Product = require('../models/product');
var Cart = require('../models/cart');
var passport = require('passport');

router.get('/', function(req, res, next){
    Product.find({}, function(err, result){
        if (!req.user) {
            res.render('main-index', {product: result, user: null});
        }else{
            if (req.user.type != 'user') {
                res.render('main-index', {product: result, user: null});
            }else{
                res.render('main-index', {product: result, user: req.user.id, cart: res.locals.cart})
            }
        }
    })
})

router.get('/about', function(req, res){
    res.render('main-about');
})

router.get('/contact', function(req, res){
    res.render('main-contact');
})

module.exports = router;