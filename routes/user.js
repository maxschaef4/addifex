var router = require('express').Router();
var User = require('../models/user');
var Cart = require('../models/cart');
var passport = require('passport');
var passportConfig = require('../config/passport');
var async = require('async');

router.get('/signup', function(req, res){
    res.render('signup', {layout: 'simple.handlebars', message: req.flash('signup')});
})

router.post('/signup', function(req, res, next){
    async.waterfall([
        function (callback) {
            var user = new User();
            
            user.name = req.body.name;
            user.email = req.body.email;
            user.password = req.body.password;
            
            User.findOne({email: req.body.email}, function(err, existingUser){
                if (err) return next(err);
                
                if (existingUser) {
                    req.flash('signup', 'Account with that email already exists');
                    return res.redirect('/signup');
                }else{
                    user.save(function(err, user){
                        if (err) return next(err);
                        callback(null, user);
                    })
                }
            })
        },
        function (user) {
            var cart = new Cart();
            
            cart.buyer = user._id;
            cart.save(function(err){
                if (err) return next(err);
                
                req.logIn(user, function(err){
                    if (err) return next(err);
                    res.redirect('/account');
                })
            })
        }
    ])
})

router.get('/signin', function(req, res){
    res.render('signin', {layout: 'simple.handlebars', message: req.flash('success')});
})

router.post('/signin', passport.authenticate('user', {
    successRedirect: '/account',
    failureRedirect: '/signin',
    failureFlash: true
}))

router.get('/cart', function(req, res, next){
    if (!req.user) {
        res.render('cart', {cart: null});
    }else if (req.user.account.type != 'user') {
        res.render('cart', {cart: null});
    }else{
        Cart.findOne({buyer: req.user._id}).populate('products.product').exec(function (err, cart){
            if (err) return next(err);
            
            res.render('cart', {cart: cart, message: req.flash('cart')});
        })
    }
})

//post is used for removing a product from the cart
router.post('/cart', function(req, res, next){
    Cart.find({'buyer': req.user._id}, function(err, cart){
        if (err) return next(err);
        
        //cart variable is an array so in order for cart to be accessed and saved we must get the cart at the 0 index of cart array
        
        if (cart.length == 0) {
            res.status('500').send('Internal Error');
        }
        
        //boolean variable that is set true when one product is removed from array
        //makes it so that the loop doesn't remove the same product in case user accidentally adds product twice
        var removed = false;
        //adds products that don't have same id to temp array and reassigns this array to products array in cart
        var temp = [];
        
        while (cart[0].products.length != 0) {
            //removes last product from product array in cart
            e = cart[0].products.pop();
            
            //checks if product id in cart matches the product to be removed
            //if it doesn't match, it is added to the temp array to later be reassigned
            //the product array in cart is reduced to 0 (through popping the last element) in this loop and the product are applied to another array
            //at the end of the loop, the product array length will be 0
            if (e.product != req.body.productId){
                temp.push(e);
            }else{
                //if the product id does match, boolean removed is checked to see if another product has been removed
                //if it hasn't, the cart total is subtracted by product price and the items count is decremented
                //the removed flag will then be set to true
                //once true, if another product in the cart has the same id, it won't removed by this loop and will added to the temp array
                //prevents a user from having to re-add the product in case they accidentally added the product to the cart twice
                if (removed != true) {
                    cart[0].total = parseFloat((cart[0].total - e.price)).toFixed(2);
                    cart[0].items--;
                    removed = true;
                }else{
                    temp.push(e);
                }
            }
        }
        
        //temp array is assigned to the products array in cart
        cart[0].products = temp;
        
        cart[0].save(function(err, cart){
            if (err) return next(err);
            
            req.flash('cart', 'Product Removed');
            res.redirect('/cart');
        })
    })
})

router.get('/checkout', function(req, res, next){
    Cart.find({'buyer': req.user._id}, function(err, cart){
        if (err) return next(err);
        
        var preOrder = {};
        
        
    })
})

router.get('/account', function(req, res, next){
    if (!req.user) {
        res.render('account');
    }else{
        User.findOne({_id: req.user._id}, function(err, user){
            if (err) return next(err);
            
            
            res.render('account', {user: user});
        })
    }
})

router.get('/account/edit-info', function(req, res){
    res.render('edit-info', {layout: 'simple.handlebars', message: req.flash('success')});
})

router.post('/account/edit-info', function(req, res, next){
    User.findOne({_id: req.user._id}, function(err, user){
        if (err) return next(err);
        
        if (!user) {
            req.flash('success', 'Problem updating your account');
            return next();
        }
        
        if (req.body.name) user.name = req.body.name;
        if (req.body.email) user.email = req.body.email;
        
        user.save(function (err){
            if (err) return next(err);
            req.flash('success', 'Account has been updated');
            return res.redirect('/account');
        })
    })
})

router.get('/signout', function(req, res){
    req.logout();
    res.redirect('/');
})
        
router.get('/notifications', function(req, res){
    res.render('notifications');
})

module.exports = router;