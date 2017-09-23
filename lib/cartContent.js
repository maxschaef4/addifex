exports.countCart = function(cart) {
    if (!cart) {
        return 0;
    }else{
        return cart.length;
    }
}