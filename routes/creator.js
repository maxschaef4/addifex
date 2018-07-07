var router = require('express').Router();
var Creator = require('../models/creator');
var passport = require('passport');
var fs = require('fs');

router.get('/dashboard/signup', function(req, res){
    res.render('creator-signup', {layout: 'simple.handlebars', message: req.flash('success')});
})

router.post('/dashboard/signup', function(req, res, next){
    var creator = new Creator();
    
    creator.name = req.body.name;
    creator.email = req.body.email;
    creator.password = req.body.password;
    creator.address.line1 = req.body.line1;
    creator.address.line2 = req.body.line2;
    creator.address.city = req.body.city;
    creator.address.state = req.body.state;
    creator.address.zip = req.body.zip;
    creator.shopName = req.body.shopName;
    creator.about = req.body.about;
    creator.category = req.body.category;
    
    Creator.findOne({email: req.body.email}, function(err, existingCreator){
        if (err) return next(err);
        
        if (existingCreator) {
            req.flash('success', 'Account with that email already exists');
            return res.redirect('/dashboard/signup');
        }else{
            creator.save(function(err, creator){
                if (err) return next(err);
                
                var path = __dirname.substring(0, __dirname.indexOf('/routes')) + '/tmp/' + creator._id;
                
                fs.mkdir(path, function(err){
                    if (err) return next(err);
                    
                    req.logIn(creator, function(err){
                        if (err) return next(err);
                        res.redirect('/dashboard');
                    })
                })
            })
        }
    })
})

router.get('/dashboard/signin', function(req, res){
    if (!req.user) {
        res.render('dashboard-signin', {layout: 'simple.handlebars', message: req.flash('success')});
    }else{
        if (req.user.type == 'creator') {
            res.redirect('/dashboard');
        }else{
            res.render('dashboard-signin', {layout: 'simple.handlebars', message: req.flash('success')});
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
                res.status('403').json("You do not have permission");
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