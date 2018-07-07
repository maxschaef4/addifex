const router = require('express').Router();
const cartHelper = require('../lib/guest');
const Order = require('../models/order');

router.get('/guest/signup', function(req, res){
    if (!req.session.user) {
        res.render('guest-signup', {layout: 'simple.handlebars'});
    }else{
        res.render('guest-signup', {layout: 'simple.handlebars', guest: req.user.session});
    }
})

router.post('/guest/signup', function(req, res){
    var guest = {
        name: req.body.name,
        shipping: {
            line1: req.body.shippingLine1,
            line2: req.body.shippingLine2,
            city: req.body.shippingCity,
            state: req.body.shippingState,
            zip: req.body.shippingZip
        },
        billing: {
            line1: req.body.billingLine1,
            line2: req.body.billingLine2,
            city: req.body.billingCity,
            state: req.body.billingState,
            zip: req.body.billingZip
        }
    }
    
    req.session.guest = guest;
    
    res.redirect('/cart/checkout');
})

router.get('/guest/view-order/:id', function(req, res){
    Order.find({buyer: req.params.id}, function(err, orders){
        if (err) return next(err);
        
        res.render('guest-view-order', {order: orders});
    })
})

module.exports = router;