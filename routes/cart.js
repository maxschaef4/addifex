const router = require('express').Router();
const Cart = require('../models/cart');
const User = require('../models/user');
const Order = require('../models/order');
const cartHelper = require('../lib/guest');
const async = require('async');
const ObjectId = require('mongodb').ObjectId;

router.get('/cart', function(req, res, next){
    if (!req.user || req.user.type != 'user') {
        res.render('cart-view', {cart: req.session.cart});
    }else{
        Cart.findOne({buyer: req.user.id}).populate('products.product').exec(function (err, cart){
            if (err) return next(err);
            
            res.render('cart-view', {cart: cart, message: req.flash('cart')});
        })
    }
})

//post is used for removing a product from the cart
router.post('/cart', function(req, res, next){
    
    let removed = false;
    //adds products that don't have same id to temp array and reassigns this array to products array in cart
    let temp = [];
    
    if (!req.user) {        
        req.session.cart = cartHelper.remove(req.session.cart, req.body.productId, function(cart){
            req.flash('cart', 'Product Removed');
            return res.redirect('/cart');
        })
    }else{
        Cart.find({'buyer': req.user.id}, function(err, cart){
            if (err) return next(err);
            
            //cart variable is an array so in order for cart to be accessed and saved we must get the cart at the 0 index of cart array
            if (cart.length == 0) {
                res.status('500');
                return next();
            }
            
            cart[0].remove(req.body.productId, function(done){
                cart[0].save(function(err, cart){
                    if (err) return next(err);
                    
                    req.flash('cart', 'Product Removed');
                    return res.redirect('/cart');
                })
            })
        })
    }
})

router.get('/cart/checkout', function(req, res, next){
    //Create a function for building preOrders
    //Since cart comes from the database or the session
    var noUser = false;
    
    if (req.session.guest && !req.session.cart) {
        req.flash('cart', 'There are no products in your cart');
        res.redirect('/cart');
    }
    
    if (!req.session.guest) {
        noUser = true;
    }
    
    //This is for guest checkout
    //It gets the preOrder information from req.session.cart.products
    if (!req.user) {
        var preOrder = [];
        var productList = req.session.cart.products;
        
        //loops through the list of products and pops each product off and converts the info from that product into a new order
        for(var i = 0; i < req.session.cart.products.length; i++){
            var tempProd = req.session.cart.products[i];
            
            var orderTemp = {
                buyer: {
                    id: null,
                    name: req.body.name
                },
                creator: {
                    id: tempProd.creator,
                    name: null
                },
                product: {
                    productId: tempProd.productId,
                    name: tempProd.name,
                    price: tempProd.price,
                    color: (tempProd.color.length == 0 ? 'N/A' : tempProd.color),
                    size: (tempProd.size.length == 0 ? 'N/A' : tempProd.size),
                    other: (tempProd.other.length == 0 ? 'N/A' : tempProd.other),
                },
                from: {
                    city: tempProd.shipping.city,
                    state: tempProd.shipping.state,
                    zip: tempProd.shipping.zip
                },
                to: {
                    line1: req.session.guest.shipping.line1,
                    line2: req.session.guest.shipping.line2,
                    city: req.session.guest.shipping.city,
                    state: req.session.guest.shipping.state,
                    zip: req.session.guest.shipping.zip,
                },
                subTotal: (tempProd.price + tempProd.shipping.cost),
                shipping: {
                    cost: tempProd.shipping.cost,
                    time: tempProd.shipping.time,
                    weight: tempProd.shipping.weight
                },
                tax: 0.0,
                total: this.subTotal * (1 + this.tax),
                build: tempProd.buildTime
            }
            
            preOrder.push(orderTemp);
        }
        
        //store preOrder array onto the session
        //don't worry about session preOrder already filled
        req.session.preOrder = preOrder;
        
        res.render('cart-checkout', {preOrder: preOrder});
    }else{
        Cart.find({'buyer': req.user.id}, function(err, cart){
            if (err) return next(err);
            
            if (cart.length == 0){
                res.status('500');
                return next();
            }
            
            User.find(req.user.id, function(err, user){
                if (err) return next(err);
                
                if (cart[0].products.length === 0 || !req.session.preOrder) {
                    req.flash('cart', 'There are no items in your cart');
                    
                    res.redirect('/cart');
                }
                
                //the preOrder array holds objects of mock order objects
                //no order object is created from Order model
                //may change that later
                var preOrder = [];
                
                //productList gets the list of products from cart[0]
                var productList = cart[0].products;
                
                //loops through the list of products and pops each product off and converts the info from that product into a new order
                while (productList != 0) {
                    var orderTemp = {};
                    var tempProd = productList.pop();
                    
                    orderTemp.buyer = req.user.id;
                    orderTemp.creator = tempProd.creator;
                    orderTemp.product = {};
                    orderTemp.product.productId = tempProd.productId;
                    orderTemp.product.name = tempProd.name;
                    orderTemp.product.price = tempProd.price;
                    orderTemp.product.color = (tempProd.color.length == 0 ? 'N/A' : tempProd.color);
                    orderTemp.product.size = (tempProd.size.length == 0 ? 'N/A' : tempProd.size);
                    orderTemp.product.other = (tempProd.other.length == 0 ? 'N/A' : tempProd.other);
                    orderTemp.from = {};
                    orderTemp.from.city = tempProd.shipping.city;
                    orderTemp.from.state = tempProd.shipping.state;
                    orderTemp.from.zip = tempProd.shipping.zip;
                    orderTemp.to = {};
                    orderTemp.to.line1 = user[0].shipping.line1;
                    orderTemp.to.line2 = user[0].shipping.line2;
                    orderTemp.to.city = user[0].shipping.city;
                    orderTemp.to.state = user[0].shipping.state;
                    orderTemp.to.zip = user[0].shipping.zip;
                    orderTemp.subTotal = (tempProd.price + tempProd.shipping.cost);
                    orderTemp.shipping = {};
                    orderTemp.shipping.cost = tempProd.shipping.cost;
                    orderTemp.shipping.time = tempProd.shipping.time;
                    orderTemp.shipping.weight = tempProd.shipping.weight;
                    orderTemp.tax = 0.0;
                    orderTemp.total = orderTemp.subTotal * (1 + orderTemp.tax);
                    orderTemp.buildTime = tempProd.buildTime;
                    
                    preOrder.push(orderTemp);
                }
                
                //store preOrder array onto the session
                //don't worry about session preOrder already filled
                req.session.preOrder = preOrder;
                
                res.render('cart-checkout', {preOrder: preOrder, noUser: noUser});
            })
        })
    }
})

router.post('/cart/checkout', function(req, res, next){
    var guestId;
    
    if (!req.session.preOrder) return res.redirect('/cart');
    
    if (!req.user) {
        res.redirect('/cart/unsigned');
    }
    Cart.find({'buyer': req.user.id}, function(err, cart){
        async.each(req.session.preOrder, function(preOrder, callback){
            var order = new Order();
            
            order.buyer = (guestId ? guestId : req.user.id);
            order.creator.id = preOrder.creator;
            order.creator.name = null;
            order.product.productId = preOrder.product.productId;
            order.product.name = preOrder.product.name;
            order.product.price = preOrder.product.price;
            order.product.size = preOrder.product.size;
            order.product.color = preOrder.product.color;
            order.product.other = preOrder.product.other;
            order.from.city = preOrder.from.city;
            order.from.state = preOrder.from.state;
            order.from.zip = preOrder.from.zip;
            order.to.line1 = preOrder.to.line1;
            order.to.line2 = preOrder.to.line2;
            order.to.city = preOrder.to.city;
            order.to.state = preOrder.to.state;
            order.to.zip = preOrder.to.zip;
            order.subtotal = preOrder.subTotal;
            order.shipping.cost = preOrder.shipping.cost;
            order.shipping.time = preOrder.shipping.time;
            order.shipping.weight = preOrder.shipping.weight;
            order.tax = preOrder.tax;
            order.total = preOrder.total;
            order.buildTime = preOrder.buildTime;
            
            order.save(function(err){
                if (err) return next(err);
                
                order = null;
                
                callback();
            })
        }, function(err){
            if (err) return next(err);
            
            if (!req.user) req.session.cart = null;
            req.session.preOrder = null;
            cart[0].clear(function(done){
                cart[0].save(function(err){
                    if (req.user) {
                        res.redirect('/order/postview');
                    }else{
                        res.redirect('/guest/view-order/' + guestId)
                    }
                })
            })
        })
    })
})

router.get('/cart/unsigned', function(req, res){
    res.render('cart-no-user', {layout: 'simple.handebars'});
})

module.exports = router;