const router = require('express').Router();
const Cart = require('../models/cart');
const User = require('../models/user');
const cartHelper = require('../lib/cart');
const async = require('async');

router.get('/cart', function(req, res, next){
    if (!req.user || req.user.type != 'user') {
        res.render('cart', {cart: req.session.cart});
    }else{
        Cart.findOne({buyer: req.user.id}).populate('products.product').exec(function (err, cart){
            if (err) return next(err);
            
            res.render('cart', {cart: cart, message: req.flash('cart')});
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
            res.status('500').send('Internal Error');
        }
        
        cart[0].remove(req.body.productId)
        
        cart[0].save(function(err, cart){
            if (err) return next(err);
            
            req.flash('cart', 'Product Removed');
            return res.redirect('/cart');
        })
    })
    }
})

router.get('/checkout', function(req, res, next){
    
    if (!req.user) {
        res.status('403').send('Please sign in to access');
        next();
    }
    
    Cart.find({'buyer': req.user.id}, function(err, cart){
        if (err) return next(err);
        
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
            
            orderTemp.buyer = req.user._id;
            orderTemp.creator = tempProd.creator;
            orderTemp.product = {};
            orderTemp.product.productId = tempProd.product;
            orderTemp.product.name = tempProd.name;
            orderTemp.product.price = tempProd.price;
            orderTemp.product.color = (tempProd.color.length == 0 ? 'N/A' : tempProd.color);
            orderTemp.product.size = (tempProd.size.length == 0 ? 'N/A' : tempProd.size);
            orderTemp.product.other = (tempProd.other.length == 0 ? 'N/A' : tempProd.other);
            //orderTemp.from.city = 
            //orderTemp.from.state =
            //orderTemp.from.zip =
            orderTemp.to = {};
            orderTemp.to.address1 = req.user.address.line1;
            orderTemp.to.address2 = req.user.address.line2;
            orderTemp.to.city = req.user.address.city;
            orderTemp.to.state = req.user.address.state;
            orderTemp.to.zip = req.user.address.zip;
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
        
        console.log(req.session);
        
        res.render('checkout', {preOrder: preOrder});
    })
})

module.exports = router;