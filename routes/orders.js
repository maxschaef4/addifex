const router = require('express').Router();
const Order = require('../models/order');

router.get('/dashboard/orders', function(req, res, next){
    if (!req.user) {
        res.redirect('/dashboard/signin');
    }else if (req.user.type == 'creator') {
        res.redirect('/dashboard/signin');
    }else{
        Order.find({'creator.id': req.user.id}, function(err, orders){
            if (err) return next(err);
            
            res.render('dashboard-orders', {orders: orders});
        })
    }
})

router.get('/order/postview', function(req, res, next){
    Order.find({buyer: req.user.id}, function(err, orders){
        if (err) return next(err);
        
        res.render('order-postview', {orders: orders});
    })
})

module.exports = router;