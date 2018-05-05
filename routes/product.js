var router = require('express').Router();
var mongoose = require('mongoose');
var Creator = require('../models/creator');
var Product = require('../models/product');
var Cart = require('../models/cart');
var async = require('async');
var fs = require('fs');
var formidable = require('formidable');

router.get('/product/:id', function(req, res, next){
    if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
        res.status('404').json("Page doesn't exist");
        next();
    }else{
        async.waterfall([
            function(callback) {
                Product.find({'_id': req.params.id}, function(err, product){
                    if (err) return next(err);
                    
                    if (product.length == 0) {
                        res.status('404').json("Page doesn't exist");
                        return next();
                    }else{
                        callback(null, product[0]);
                    }
                })
            },
            function(product, callback) {
                Creator.find({'_id': product.info.creatorId}, function(err, creator){
                    if (err) return next(err);
                    
                    if (!creator) {
                        res.status('500').send("Internal Error");
                    }
                    
                    res.render("product", {product: product, message: req.flash('product'), creator: creator[0]})
                })
            }
            
        ])
    }
})

router.post('/product/:id', function(req, res, next){
    Cart.findOne({buyer: req.user._id}, function(err, cart){
        if (err) return next(err);
        
        if (!cart) {
            return res.redirect('/product/' + req.params.id);
        }
        
        cart.products.push({
            product: req.body.productId,
            name: req.body.name,
            price: parseFloat(req.body.price),
            shippingCost: parseFloat(req.body.shippingCost),
            color: req.body.color,
            size: req.body.size,
            other: req.body.other,
            creator: req.body.creatorId
        })
        
        cart.total = (cart.total + parseFloat(req.body.price)).toFixed(2);
        cart.items++;
        
        cart.save(function(err){
            if (err) return next(err);
            
            req.flash('product', "Product Added to Cart");
            return res.redirect('/product/' + req.params.id);
        })
    })
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
    
    var form = new formidable.IncomingForm();
    form.multiple = true;
    var path = __dirname.substring(0, __dirname.indexOf('/routes')) + '/public/tmp/' + req.user._id + '/' + product._id;
    
    Creator.findOne({_id: req.user._id}, function(err, creator){
        if (err) return next(err);
        
        if (!creator) {
            req.flash('creator', 'Product failed to be uploaded');
            res.redirect('/dashboard-products-new');
            next();
        }
        async.waterfall([
            function(callback) {
                fs.mkdir(path, function(err){
                    if (err) return next(err);
                })
                
                form.on('fileBegin', function(name, file){
                    console.log(file);
                    file.path = path + '/' + file.name;
                })
                
                form.parse(req, function(err, fields, files){
                    product.name = fields.name;
                    product.price = fields.price;
                    product.shipping.cost = fields.shipCost;
                    product.shipping.time = fields.shipTime;
                    product.description = fields.description;
                    product.buildTime = fields.buildTime;
                    product.options.sizes = fields.sizes.split(',');
                    product.options.colors = fields.colors.split(',');
                    product.options.others = fields.others.split(',');
                    product.category = fields.category;
                    product.keywords = fields.keywords.split(',');
                    product.info.creatorId = req.user._id;
                    
                    callback(null);
                })
            },
            function(callback) {
                creator.products.push(product._id);
                
                //updates the creators date to upload time
                //creator.account.updated = new Date();
                
                creator.save(function(err){
                    if (err) return next(err);
                })
                
                product.save(function(err){
                    if (err) return next(err);
                    req.flash('creator', 'Product added successfully');
                    callback(res.redirect('/dashboard-products'));
                })
            }
        ])
    })
})

router.get('/dashboard-products-view/:id', function(req, res, next){
    Product.find({'_id': req.params.id}, function(err, product){
        if (err) return next(err);
        
        if (product.length == 0) {
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

router.post('/dashboard-products-view/:id', function(req, res, next){
    Product.remove({'_id': req.params.id}, function(err, product){
        if (err) return next(err);
        
        Creator.find({'_id': req.user._id}, function(err, creator){
            if (err) return next(err);
            
            if (!creator) {
                res.status('500').json("Internal Error");
                return next();
            }
            
            var temp = [];
            
            while(creator[0].products.length != 0){
                var e = creator[0].products.pop();
                
                if (req.params.id != e) {
                    temp.push(e);
                }
            }
            
            creator[0].products = temp;
            
            creator[0].save(function(err, creator){
                req.flash('creator', "Product successfully deleted");
                res.redirect('/dashboard-products');
            })
        })
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
        if (req.body.price) product[0].price = req.body.price;
        if (req.body.shipCost) product[0].shipping.cost = req.body.shipCost;
        if (req.body.shipTime) product[0].shipping.time = req.body.shipTime;
        if (req.body.description) product[0].description = req.body.description;
        if (req.body.buildTime) product[0].buildTime = req.body.buildTime;
        if (req.body.colors) product[0].options.colors = req.body.colors;
        if (req.body.sizes) product[0].options.sizes = req.body.sizes;
        if (req.body.others) product[0].options.others = req.body.others;
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