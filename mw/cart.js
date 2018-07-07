var Cart = require('../models/cart');

module.exports = {
    gettingInfo: function(req, res, next){
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
    },
    unsignedCart: function(req, res, next){
        if (!req.user || req.user.type == 'creator') {
            req.session.cart = (!req.session.cart ? {} : req.session.cart);
            
            req.session.cart.total = (!req.session.cart.total ? 0.00 : req.session.cart.total);
            req.session.cart.items = (!req.session.cart.items ? 0.00 : req.session.cart.items);
            req.session.cart.products = (!req.session.cart.products ? [] : req.session.cart.products);
        }else{
            delete req.session.cart;
        }
        
        next();
    }
}