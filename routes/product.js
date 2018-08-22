var router = require('express').Router();
var mongoose = require('mongoose');
var Creator = require('../models/creator');
var Shop = require('../models/shop');
var Product = require('../models/product');
var Cart = require('../models/cart');
var User = require('../models/user');
var async = require('async');
var fs = require('fs');
var formidable = require('formidable');

router.get('/product/:id', function(req, res, next){
    if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
        res.status('404');
        return next();
    }
    
    async.waterfall([
        function(callback) {
            Product.find({'_id': req.params.id}, function(err, product){
                if (err) return next(err);
                
                if (product.length == 0) {
                    res.status('404');
                    return next();
                }else{
                    callback(null, product[0]);
                }
            })
        },
        function(product, callback) {
            Creator.find({'_id': product.info.shopId}, function(err, shop){
                if (err) return next(err);
                
                return res.render("product-main", {product: product, cartMessage: req.flash('product'), favMessage: req.flash('favorite'), shop: shop[0]})
            })
        }
    ])
})

router.post('/product/:id', function(req, res, next){
    if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
        res.status('404');
        return next();
    }
    
    Product.find({_id: req.params.id}, function(err, product){
        if (err){
            res.status('500');
            return next(err);
        }else if (product.length == 0) {
            res.status('404');
            return next();
        }
        
        Shop.find(product[0].info.shopId, function(err, shop){
            //runs for guest checkout
            if (!req.user || req.user.type == 'creator') {
                var cart = {};
                cart.productId = req.body.productId;
                cart.name = product[0].name;
                cart.price = parseFloat(product[0].price);
                cart.shipping = {};
                cart.shipping.cost = product[0].shipping.cost;
                cart.shipping.time = product[0].shipping.time;
                cart.shipping.weight = product[0].shipping.weight;
                cart.shipping.city = shop[0].shipping.city;
                cart.shipping.state = shop[0].shipping.state;
                cart.shipping.zip = shop[0].shipping.zip;
                cart.color = req.body.color;
                cart.size = req.body.size;
                cart.other = req.body.other;
                cart.creator = product[0].info.creatorId;
                
                req.session.cart.total = parseFloat((parseFloat(req.session.cart.total) + parseFloat(product[0].price)).toFixed(2));
                req.session.cart.items++;
                
                req.session.cart.products.push(cart);
                
                req.flash('product', "Product Added to Cart");
                return res.redirect('/product/' + req.params.id);
            }else{
                Cart.find({buyer: req.user.id}, function(err, cart){
                    if (err) return next(err);
                    
                    if (!cart[0]) {
                        return res.redirect('/product/' + req.params.id);
                    }
                    
                    var productToAdd = {
                        productId: req.body.productId,
                        name: product[0].name,
                        price: parseFloat(product[0].price),
                        shipping: {
                            cost: product[0].shipping.cost,
                            time: product[0].shipping.time,
                            weight: product[0].shipping.weight,
                            city: shop[0].shipping.city,
                            state: shop[0].shipping.state,
                            zip: shop[0].shipping.zip,
                        },
                        color: req.body.color,
                        size: req.body.size,
                        other: req.body.other,
                        creator: product[0].info.shopId
                    }
                    
                    cart[0].products.push(productToAdd);
                    
                    cart[0].total = parseFloat((parseFloat(cart[0].total) + parseFloat(product[0].price)).toFixed(2));
                    cart[0].items++;
                    
                    cart[0].save(function(err){
                        if (err) return next(err);
                        
                        req.flash('product', "Product Added to Cart");
                        return res.redirect('/product/' + req.params.id);
                    })
                })
            }
        })
    })
})

router.get('/product/:id/favorite', function(req, res, next){
    if (!mongoose.Types.ObjectId.isValid(req.params.id)){
        res.status('404');
        return next();
    }
    
    if (!req.user){
        req.flash('favorite', "Sign In to Favorite");
        return res.redirect('/product/' + req.params.id);
    }
    
    if (req.user.type == 'creator') {
        req.flash('favorite', "Sign In to Favorite");
        return res.redirect('/product/' + req.params.id);
    }
    
    User.find({_id: req.user.id}, function(err, user){
        if (err) return next(err);
        
        user[0].updateFavs(req.params.id, function(flag){
            if (!flag) {
                req.flash('favorite', 'Already Favorited');
                return res.redirect('/product/' + req.params.id);
            }
            
            user[0].save(function(err){
                if (err) return next(err);
                
                req.flash('favorite', 'Item has been Favorited');
                return res.redirect('/product/' + req.params.id);
            })
        })
    })
})

router.get('/shop/:name', function(req, res){
    Shop.find({'shopName': req.params.name}, function(err, shop){
        if (err) return next(err);
        
        if (!shop[0]) {
            res.status('404');
            return next();
        }
        
        Creator.find(shop[0].creatorId, function(err, creator){
            if (err) return next(err);
            
            Product.find({'info.shopId': shop[0]._id}, function(err, products){
                if (err) return next(err);
                
                res.render('shop-main', {product: products, shop: shop[0], creator: creator[0]});
            })
        })
    })
})

router.get('/dashboard/products', function(req, res, next){
    Product.find({"info.shopId": req.user.id}, function(err, products){
        if (err) return next(err);
        
        res.render('dashboard-products', {layout: 'simple.handlebars', message: req.flash('shop'), product: products});
    })
})

router.get('/dashboard/products/new', function(req, res){
    res.render('dashboard-products-new', {layout: 'simple.handlebars', message: req.flash('shop')});
})

router.post('/dashboard/products/new', function(req, res, next){
    
    var product = new Product();
    
    var form = new formidable.IncomingForm();
    form.multiple = true;
    var path = __dirname.substring(0, __dirname.indexOf('/routes')) + '/tmp/' + product._id;
    
    Shop.find({creatorId: req.user.id}, function(err, shop){
        if (err) return next(err);
        
        if (!shop[0]) {
            req.flash('creator', 'Product failed to be uploaded');
            res.redirect('/dashboard/products/new');
            next();
        }
        
        async.waterfall([
            function(callback) {
                fs.mkdir(path, function(err){
                    if (err) return next(err);
                })
                
                form.on('fileBegin', function(name, file){
                    file.path = path + '/' + file.name;
                })
                
                form.parse(req, function(err, fields, files){
                    product.name = fields.name;
                    product.price = fields.price;
                    product.shipping.cost = fields.shipCost;
                    product.shipping.time = fields.shipTime;
                    product.description = fields.description;
                    product.buildTime = fields.buildTime;
                    //option fields get converted to a string with each item separated by a comma
                    //calling split returns array and can be assigned to product options as an array
                    product.options.sizes = fields.sizes.split(',');
                    product.options.colors = fields.colors.split(',');
                    product.options.others = fields.others.split(',');
                    product.category = fields.category;
                    product.keywords = fields.keywords.split(',');
                    product.info.shopId = shop[0]._id;
                    
                    //var datetime = new Date();
                    //
                    //for(var i = 0; i < files.length; i++){
                    //    
                    //    files[i].name = datetime + '_' + i;
                    //}
                    
                    callback(null);
                })
            },
            function(callback) {
                shop[0].products.push(product._id);
                
                //updates the creators date to upload time
                //creator.account.updated = new Date();
                
                shop[0].save(function(err){
                    if (err) return next(err);
                    
                    product.save(function(err){
                        if (err) return next(err);
                        req.flash('creator', 'Product added successfully');
                        callback(res.redirect('/dashboard/products'));
                    })
                })
            }
        ])
    })
})

router.get('/dashboard/products/view/:id', function(req, res, next){
    if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
        res.status('404');
        return next();
    }
    
    Product.find({'_id': req.params.id}, function(err, product){
        if (err) return next(err);
        
        if (product.length == 0) {
            res.status('404');
            return next();
        }
        
        if (!req.user) return res.redirect('/dashboard/signin');
        
        if (req.user.type == 'user'){
            res.status('403');
            return next();
        }
        
        if (product[0].info.shopId.equals(req.user.id)) {
            console.log(product[0].info.shopId);
            console.log(req.user.id);
            res.render('dashboard-products-view', {layout: 'simple.handlebars', product: product[0], message: req.flash('success')});
        }else{
            res.status('403').json("You do not have permission");
            return next();
        }
    })
})

router.post('/dashboard/products/view/:id', function(req, res, next){
    
    if (!req.user) return res.redirect('/dashboard/signin');
    
    if (req.user.type == 'user')
        res.status('403');
        return next();
    
    Product.remove({'_id': req.params.id}, function(err, product){
        if (err) return next(err);
        
        Shop.find({'creatorId': req.user.id}, function(err, creator){
            if (err) return next(err);
            
            if (!creator) {
                res.status('500');
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
            
            temp = null;
            
            creator[0].save(function(err, creator){
                req.flash('creator', "Product successfully deleted");
                res.redirect('/dashboard/products');
            })
        })
    })
})

router.get('/dashboard/products/edit/:id', function(req, res){
    if (!req.user) return res.redirect('/dashboard/signin');
    
    if (req.user.type == 'user'){
        res.status('403');
        return next();
    }
    
    if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
        res.status('404');
        return next();
    }
    
    Product.find({'_id': req.params.id}, function(err, product){
        if (err) return next(err);
        
        if (product.length == 0) {
            res.status('404');
            return next();
        }
        
        if (product[0].info.creatorId.equals(req.user.id)) {
            res.render('dashboard-products-edit', {layout: 'simple.handlebars', product: product[0], message: req.flash('success')});
        }else{
            res.status('403');
            return next();
        }
    })
})

router.post('/dashboard/products/edit/:id', function(req, res, next){
    if (!req.user) return res.redirect('/dashboard/signin');
    
    if (req.user.type == 'user')
        res.status('403');
        return next();
    
    if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
        res.status('404');
        return next();
    }
    
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
            return res.redirect('/dashboard/products/view/' + product[0]._id);
        })
    })
})

module.exports = router;