var router = require('express').Router();
var Creator = require('../models/creator');
var Shop = require('../models/shop');
var passport = require('passport');
var fs = require('fs');

router.get('/dashboard/open-shop', function(req, res){
    res.render('dashboard-open-shop', {layout: 'simple.handlebars', message: req.flash('creator')});
})

router.post('/dashboard/open-shop', function(req, res, next){
    if (!req.user || req.user.type == 'user'){
        req.flash('creator', 'Must be a creator to open a shop');
        res.redirect('/dashboard/signin');
    }
    
    Creator.find(req.user.id, function(err, creator){
        if (err) return next(err);
        
        if (creator.length == 0){
            req.flash('creator', 'Must be a creator to open a shop');
            res.redirect('/dashboard/signin');
        }
    
        var shop = new Shop();
        
        var path = __dirname.substring(0, __dirname.indexOf('/routes')) + '/tmp/' + shop._id;
        
        shop.creatorId = req.user.id;
        shop.shopName = req.body.shopName;
        shop.about = req.body.about;
        shop.category = req.body.category;
        shop.keywords = req.body.keywords.split(',');
        shop.shipping.line1 = req.body.shippingLine1;
        shop.shipping.line2 = req.body.shippingLine2;
        shop.shipping.city = req.body.shippingCity;
        shop.shipping.state = req.body.shippingState;
        shop.shipping.zip = req.body.shippingZip;
        shop.billing.line1 = (req.body.billingLine1.length == 0 ? req.body.shippingLine1 : req.body.billingLine1);
        shop.billing.line2 = (req.body.billingLine2.length == 0 ? req.body.shippingLine2 : req.body.billingLine2);
        shop.billing.city = (req.body.billingCity.length == 0 ? req.body.shippingCity : req.body.billingCity);
        shop.billing.state = (req.body.billingState.length == 0 ? req.body.shippingState : req.body.billingState);
        shop.billing.zip = (req.body.billingZip.length == 0 ? req.body.shippingZip : req.body.billingZip);
        
        shop.save(function(err){
            if (err) return next(err);
            
            fs.mkdir(path, function(err){
                if (err) return next(err);
                
                res.redirect('/dashboard');
            })
        })
    })
})

router.get('/dashboard/myShop', function(req, res, next){
    if (!req.user){
        req.flash('creator', 'Must be a creator to open a shop');
        res.redirect('/dashboard/signin');
    }else if (req.user.type == 'user') {
        req.flash('creator', 'Must be a creator to open a shop');
        res.redirect('/dashboard/signin');
    }
    
    Shop.find({'creatorId': req.user.id}, function(err, myShop){
        if (err) return next(err);
        
        console.log(myShop);
        
        if (myShop.length == 0){
            res.render('dashboard-my-shop', {shop: null, layout: 'simple.handlebars'});
        }else{
            res.render('dashboard-my-shop', {shop: myShop[0], layout: 'simple.handlebars'});
        }
    })
})

module.exports = router;