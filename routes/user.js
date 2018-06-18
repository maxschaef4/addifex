const router = require('express').Router();
const mongoose = require('mongoose');
const User = require('../models/user');
const Cart = require('../models/cart');
const passport = require('passport');
const passportConfig = require('../config/passport');
const async = require('async');

router.get('/signup', function(req, res){
    res.render('signup', {layout: 'simple.handlebars', message: req.flash('signup')});
})

router.post('/signup', function(req, res, next){
    async.waterfall([
        function (callback) {
            let user = new User();
            
            user.name = req.body.name;
            user.email = req.body.email;
            user.password = req.body.password;
            user.shipping.line1 = req.body.line1;
            user.shipping.line2 = req.body.line2;
            user.shipping.city = req.body.city;
            user.shipping.state = req.body.state;
            user.shipping.zip = req.body.zip;
            user.billing.line1 = (req.body.billLine1.length == 0 ? req.body.line1 : req.body.billLine1);
            user.billing.line2 = (req.body.billLine2.length == 0 ? req.body.line2 : req.body.billLine2);
            user.billing.city = (req.body.billCity.length == 0 ? req.body.city : req.body.billCity);
            user.billing.state = (req.body.billState.length == 0 ? req.body.state : req.body.billState);
            user.billing.zip = (req.body.billZip.length == 0 ? req.body.zip : req.body.billZip);
            
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

router.get('/account', function(req, res, next){
    if (!req.user) {
        res.redirect('/signin');
    }else{
        User.find({_id: req.user.id}, function(err, user){
            if (err) return next(err);
            
            res.render('account', {user: user[0]});
        })
    }
})

router.get('/account/edit', function(req, res){
    if (!req.user) {
        res.redirect('/signin');
    }
    
    User.find({_id: req.user.id}, function(err, user){
        res.render('edit', {layout: 'simple.handlebars', user: user[0], message: req.flash('success')});
    })
})

router.post('/account/edit', function(req, res, next){
    
    if (!req.user) {
        res.redirect('/signin');
    }
    
    User.findOne({_id: req.user.id}, function(err, user){
        if (err) return next(err);
        
        if (!user) {
            req.flash('success', 'Problem updating your account');
            return next();
        }
        
        if (req.body.name) user.name = req.body.name;
        if (req.body.email) user.email = req.body.email;
        user.shipping.line1 = req.body.line1;
        user.shipping.line2 = req.body.line2;
        user.shipping.city = req.body.city;
        user.shipping.state = req.body.state;
        user.shipping.zip = req.body.zip;
        user.billing.line1 = (req.body.billLine1.length == 0 ? req.body.line1 : req.body.billLine1);
        user.billing.line2 = (req.body.billLine2.length == 0 ? req.body.line2 : req.body.billLine2);
        user.billing.city = (req.body.billCity.length == 0 ? req.body.city : req.body.billCity);
        user.billing.state = (req.body.billState.length == 0 ? req.body.state : req.body.billState);
        user.billing.zip = (req.body.billZip.length == 0 ? req.body.zip : req.body.billZip);
        
        user.save(function (err){
            if (err) return next(err);
            req.flash('success', 'Account has been updated');
            return res.redirect('/account');
        })
    })
})
        
router.get('/account/notifications', function(req, res){
    res.render('notifications');
})

router.get('/account/favorites', function(req, res){
    res.render('favorites');
})

router.get('/account/orders', function(req, res){
    res.render('orders');
})

router.get('/account/myAccount', function(req, res){
    if (!req.user) {
        res.redirect('/signin');
    }
    
    User.find({_id: req.user.id}, function(err, user){
        if (err) return next(err);
        
        res.render('myAccount', {user: user[0]});
    })
})

router.get('/account/myAccount/delete/:id', function(req, res, next){
    if (!req.user) {
        return res.redirect('/signin');
    }
    
    if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
        res.status('404').json("Page doesn't exist");
        return next();
    }
    
    if (req.user.id != req.params.id) {
        res.status('403').json("Access Denied");
        return next();
    }else{
        
        User.remove({_id: req.user.id}, function(err, user){
            if (err) return next(err);
            
            //use async.waterfall
            req.logout();
            res.redirect('/');
        })
    }
})

router.get('/account/signout', function(req, res){
    if (!req.user) {
        res.redirect('/signin');
    }
    
    //use async.waterfall
    req.logout();
    res.redirect('/');
})

module.exports = router;