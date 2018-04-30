var Cart = require('../models/cart');

module.exports = function(req, res, next){
    if (req.user) {
        var total = 0;
        
        Cart.findOne({buyer: req.user._id}, function(err, cart){
            
            if (err) return next(err);
            
            if (cart) {
                res.locals.cart = {
                    total: cart.total,
                    items: cart.items
                }
            }else{
                res.locals.cart = 0;
            }
            next();
        })
    }else{
        next();
    }
}