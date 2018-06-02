//Used for custom functions to be used elsewhere in the application

//gets and returns the tax percentage of the state
//if states don't match it returns 0
//if states do, it returns their tax percentage
exports.getTax = function() {
    if (cart) {
        for (var i = 0; i < cart.length; i++) {
            if (product == cart[i]) {
                return true;
            }
        }
    }
    
    return false;
}