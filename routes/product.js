var router = require('express').Router();
var Creator = require('../models/creator');
var Product = require('../models/product');

router.get('/dashboard-products', function(req, res, next){
    Product.find({"info.creatorId": req.user._id}, function(err, products){
        if (err) return next(err);
        
        //console.log();
        
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
        console.log(new Date());
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

module.exports = router;