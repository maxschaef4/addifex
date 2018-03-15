var router = require('express').Router();
var mongoose = require('mongoose');
var Creator = require('../models/creator');
var Product = require('../models/product');
var async = require('async');

router.get('/product/:id', function(req, res, next){
    if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
        res.status('404').json("Page doesn't exist");
        next();
    }else{
        Product.find({'_id': req.params.id}, function(err, product){
            if (err) return next(err);
            
            if (!product) {
                res.status('404').json("Page doesn't exist");
                return next();
            }
            
            Creator.find({'_id': product[0].info.creatorId}, function(err, creator){
                if (err) return next(err);
                
                res.render('product', {product: product[0], creator: creator[0], message: req.flash('product')});
            })
        })
    }
})

router.get('/shop/:name', function(req, res){
    Creator.find({'shopName': req.params.name}, function(err, creator){
        if (err) return next(err);
            
        if (!creator) {
            res.status('404').json("Page doesn't exist");
            return next();
        }
        
        Product.find({'creatorId': creator._id}, function(err, products){
            if (err) return next(err);
            
            console.log(products);
            
            res.render('shop', {product: products, creator: creator[0]});
        })
    })
})

router.get('/dashboard-products', function(req, res, next){
    Product.find({"info.creatorId": req.user._id}, function(err, products){
        if (err) return next(err);
        
        res.render('dashboard-products', {layout: 'simple.handlebars', message: req.flash('creator'), product: products});
    })
})

router.get('/dashboard-products-new', function(req, res){
    res.render('dashboard-products-new', {layout: 'simple.handlebars', message: req.flash('creator')});
})

router.post('/dashboard-products-new', function(req, res, next){
    
    var product = new Product();
    
    product.name = req.body.name;
    product.price = req.body.price;
    product.shipping.cost = req.body.shipCost;
    product.shipping.time = req.body.shipTime;
    product.description = req.body.description;
    product.buildTime = req.body.buildTime;
    product.options.sizes = req.body.sizes;
    product.options.colors = req.body.colors;
    product.options.others = req.body.others;
    product.category = req.body.category;
    product.keywords = req.body.keywords;
    product.info.creatorId = req.user._id;
    
    Creator.findOne({_id: req.user._id}, function(err, creator){
        if (err) return next(err);
        
        if (!creator) {
            req.flash('creator', 'Product failed to be uploaded');
            res.redirect('/dashboard-products-new');
            next();
        }
        
        creator.products.push(product._id);
        
        //updates the creators date to upload time
        //creator.account.updated = new Date();
        
        creator.save(function(err){
            if (err) return next(err);
        })
        
        product.save(function(err){
            if (err) return next(err);
            req.flash('creator', 'Product added successfully');
            res.redirect('/dashboard-products');
        })
    })
})

router.get('/dashboard-products-view/:id', function(req, res, next){
    Product.find({'_id': req.params.id}, function(err, product){
        if (err) return next(err);
        
        if (!product) {
            res.status('404').json("Page doesn't exist");
            return next();
        }
        
        if (product[0].info.creatorId.equals(req.user._id)) {
            res.render('dashboard-products-view', {layout: 'simple.handlebars', product: product[0], message: req.flash('success')});
        }else{
            res.status('403').json("You do not have permission");
            return next();
        }
    })
})

router.get('/dashboard-products-edit/:id', function(req, res){
    Product.find({'_id': req.params.id}, function(err, product){
        if (err) return next(err);
        
        if (!product) {
            res.status('404').json("Page doesn't exist");
            return next();
        }
        
        if (product[0].info.creatorId.equals(req.user._id)) {
            res.render('dashboard-products-edit', {layout: 'simple.handlebars', product: product[0], message: req.flash('success')});
        }else{
            res.status('403').json("You do not have permission");
            return next();
        }
    })
})

router.post('/dashboard-products-edit/:id', function(req, res, next){
    Product.find({'_id': req.params.id}, function(err, product){
        
        if (req.body.name) product[0].name = req.body.name;
        if (req.body.price) product[0].email = req.body.price;
        if (req.body.shipCost) product[0].shipping.cost = req.body.shipCost;
        if (req.body.shipTime) product[0].shipping.time = req.body.shiptime;
        if (req.body.description) product[0].description = req.body.description;
        if (req.body.buildTime) product[0].buildTime = req.body.buildTime;
        if (req.body.colors) product[0].options.colors = req.body.colors;
        if (req.body.sizes) product[0].options.sizes = req.body.sizes;
        if (req.body.other) product[0].options.others = req.body.other;
        if (req.body.category) product[0].category = req.body.category;
        if (req.body.keywords) product[0].keywords = req.body.keywords;
        
        product[0].save(function (err){
            if (err) return next(err);
            req.flash('success', 'Product Successfully Updated');
            return res.redirect('/dashboard-products-view/' + product[0]._id);
        })
    })
})

module.exports = router;