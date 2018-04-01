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

router.get('/account', function(req, res){
    if (!req.user) {
        res.render('account');
    }else{
        User.findOne({_id: req.user._id}, function(err, user){
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