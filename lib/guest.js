const mongoose = require('mongoose');
const async = require('async');

//Used for custom functions to be used elsewhere in the application
module.exports = {
    remove: function(cart, id, done){ 
        //boolean variable that is set true when one product is removed from array
        //makes it so that the loop doesn't remove the same product in case user accidentally adds product twice
        let removed = false;
        //adds products that don't have same id to temp array and reassigns this array to products array in cart
        let temp = [];
        
        async.each(cart.products, function(product, callback){
            //removes last product from product array in cart
            var e = product;
            
            //checks if product id in cart matches the product to be removed
            //if it doesn't match, it is added to the temp array to later be reassigned
            //the product array in cart is reduced to 0 (through popping the last element) in this loop and the product are applied to another array
            //at the end of the loop, the product array length will be 0
            if (e.productId != id){
                temp.push(e);
            }else{
                //if the product id does match, boolean removed is checked to see if another product has been removed
                //if it hasn't, the cart total is subtracted by product price and the items count is decremented
                //the removed flag will then be set to true
                //once true, if another product in the cart has the same id, it won't removed by this loop and will added to the temp array
                //prevents a user from having to re-add the product in case they accidentally added the product to the cart twice
                if (removed != true) {
                    cart.total = (parseFloat(cart.total) - e.price).toFixed(2);
                    cart.items--;
                    removed = true;
                }else{
                    temp.push(e);
                }
            }
            
            callback();
            
        }, function(err){
            if (err) return done(err);
            
            cart.products = temp;
            
            return done(cart);
        })
    }
}

