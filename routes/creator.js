var router = require('express').Router();
var Creator = require('../models/creator');
var Shop = require('../models/shop');
var passport = require('passport');
var fs = require('fs');

router.get('/dashboard/signup', function(req, res){
    res.render('dashboard-signup', {layout: 'simple.handlebars', message: req.flash('creator')});
})

router.post('/dashboard/signup', function(req, res, next){
    var creator = new Creator();
    
    creator.name = req.body.name;
    creator.email = req.body.email;
    creator.password = req.body.password;
    creator.about = req.body.about;
    
    Creator.findOne({email: req.body.email}, function(err, existingCreator){
        if (err) return next(err);
        
        if (existingCreator) {
            req.flash('creator', 'Account with that email already exists');
            return res.redirect('/dashboard/signup');
        }else{
            creator.save(function(err, creator){
                if (err) return next(err);
                
                req.logIn(creator, function(err){
                    if (err) return next(err);
                    
                    //checks which button was pressed
                    //1 == continue to shop signup
                    //2 == skip to dashboard
                    if (req.body.button == 1) {
                        res.redirect('/dashboard/open-shop');
                    }else{
                        res.redirect('/dashboard');
                    }
                })
            })
        }
    })
})

router.get('/dashboard/signin', function(req, res){
    if (!req.user) {
        res.render('dashboard-signin', {layout: 'simple.handlebars', message: req.flash('creator')});
    }else{
        if (req.user.type == 'creator') {
            res.redirect('/dashboard');
        }else{
            res.render('dashboard-signin', {layout: 'simple.handlebars', message: req.flash('creator')});
        }
    }
})

router.post('/dashboard/signin', passport.authenticate('creator', {
    successRedirect: '/dashboard',
    failureRedirect: '/dashboard/signin',
    failureFlash: true
}))

router.get('/dashboard', function(req, res, next){
    if (!req.user || req.user.type != 'creator') {
        res.redirect('/dashboard/signin');
    }else{
        Creator.findOne({_id: req.user.id}, function(err, creator){
            if (!creator) {
                req.flash
                res.redirect('/dashboard/signin');
                return next();
            }else{
                res.render('dashboard', {layout: 'simple.handlebars', creator: creator});
            }
        })
    }
})

router.get('/dashboard/account/info', function(req, res){
    res.render('dashboard-info', {layout: 'simple.handlebars'});
})

router.get('/dashboard/account/edit', function(req, res){
    res.render('dashboard-edit', {layout: 'simple.handlebars'});
})

router.get('/dashboard/help', function(req, res){
    res.render('dashboard-help', {layout: 'simple.handlebars'});
})

router.get('/dashboard/account/logout', function(req, res, next){
    if (!req.user || req.user.type != 'creator') {
        res.redirect('/');
    }
    
    async.waterfall([
        function (callback) {
            req.logout();
            callback(null);
        },
        function (callback) {
            res.redirect('/');
            callback(null);
        }
    ])
})

router.get('dashboard/account/delete/:id', function(req, res){
    
})

module.exports = router;