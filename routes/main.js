var router = require('express').Router();
var Product = require('../models/product');
var Cart = require('../models/cart');
var passport = require('passport');

router.get('/', function(req, res, next){
    Product.find({}, function(err, result){
        if (!req.user) {
            res.render('index', {product: result, user: null});
        }else{
            if (req.user.account.type != 'user') {
                res.render('index', {product: result, user: null});
            }else{
                res.render('index', {product: result, user: req.user, cart: res})
            }
        }
    })
})

router.get('/cart', function(req, res, next){
    if (!req.user) {
        res.render('cart', {cart: null});
    }else if (req.user.account.type != 'user') {
        res.render('cart', {cart: null});
    }else{
        Cart.findOne({buyer: req.user._id}).populate('products.product').exec(function (err, cart){
            if (err) return next(err);
            res.render('cart', {cart: cart});
        })
    }
})

router.get('/about', function(req, res){
    res.render('about');
})

router.get('/contact', function(req, res){
    res.render('contact');
})

module.exports = router;