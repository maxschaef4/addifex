var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var CartSchema = new Schema({
    buyer: {type: Schema.Types.ObjectId, ref: 'User'},
    total: {type: Number, default: 0},
    items: {type: Number, default: 0},
    products: [{
        productId: Schema.Types.ObjectId,
        name: String,
        quantity: {type: Number, default: 1},
        price: Number,
        shipping: {
            cost: Number,
            time: String,
            weight: Number,
            city: String,
            state: String,
            zip: Number
        },
        buildTime: String,
        color: {type: String, default: null},
        size: {type: String, default: null},
        other: {type: String, default: null},
        creator: Schema.Types.ObjectId,
    }],
    info: {
        updated: {type: Date, default: Date.now}
    }
})

CartSchema.methods.remove = function(id, done){
    
    //boolean variable that is set true when one product is removed from array
    //makes it so that the loop doesn't remove the same product in case user accidentally adds product twice
    let removed = false;
    //adds products that don't have same id to temp array and reassigns this array to products array in cart
    var temp = [];
    
    while (this.products.length != 0) {
        //removes last product from product array in cart
        var e = this.products.pop();
        
        //checks if product id in cart matches the product to be removed
        //if it doesn't match, it is added to the temp array to later be reassigned
        //the product array in cart is reduced to 0 (through popping the last element) in this loop and the product are applied to another array
        //at the end of the loop, the product array length will be 0
        if (!e.productId.equals(id)){
            temp.push(e);
        }else{
            //if the product id does match, boolean removed is checked to see if another product has been removed
            //if it hasn't, the cart total is subtracted by product price and the items count is decremented
            //the removed flag will then be set to true
            //once true, if another product in the cart has the same id, it won't removed by this loop and will added to the temp array
            //prevents a user from having to re-add the product in case they accidentally added the product to the cart twice
            if (removed != true) {
                this.total = parseFloat((this.total - e.price)).toFixed(2);
                this.items--;
                removed = true;
                console.log("ell");
            }else{
                temp.push(e);
            }
        }
    }
    
    this.products = temp;
    
    done();
}

module.exports = mongoose.model('Cart', CartSchema, 'Carts');