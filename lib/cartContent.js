exports.countCart = function(cart) {
    if (!cart) {
        return 0;
    }else{
        return cart.length;
    }
}

exports.inCart = function(cart, product) {
    if (cart) {
        for (var i = 0; i < cart.length; i++) {
            if (product == cart[i]) {
                return true;
            }
        }
    }
    
    return false;
}