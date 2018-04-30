//Used for custom functions to be used elsewhere in the application

//function checks if product is already in the cart
//called in product.js
exports.checkCart = function() {
    if (cart) {
        for (var i = 0; i < cart.length; i++) {
            if (product == cart[i]) {
                return true;
            }
        }
    }
    
    return false;
}