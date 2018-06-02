var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var CartSchema = new Schema({
    buyer: {type: Schema.Types.ObjectId, ref: 'User'},
    total: {type: Number, default: 0},
    items: {type: Number, default: 0},
    products: [{
        product: {type: Schema.Types.ObjectId, ref: 'Product'},
        name: String,
        quantity: {type: Number, default: 1},
        price: Number,
        shipping: {
            cost: Number,
            time: String,
            weight: Number,
        },
        buildTime: String,
        color: {type: String, default: null},
        size: {type: String, default: null},
        other: {type: String, default: null},
        creator: {type: Schema.Types.ObjectId, ref: 'Creator'}
    }],
    info: {
        updated: {type: Date, default: Date.now}
    }
})

module.exports = mongoose.model('Cart', CartSchema, 'Carts');