const router = require('express').Router();
const Order = require('../models/order');

router.get('/order/postview', function(req, res, next){
    Order.find({buyer: req.user.id}, function(err, orders){
        if (err) return next(err);
        
        res.render('order-postview', {orders: orders});
    })
})

module.exports = router;