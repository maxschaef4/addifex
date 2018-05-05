var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var OrderSchema = new Schema({
    buyer: Schema.Types.ObjectId,
    seller: Schema.Types.ObjectId,
    products: [{
        productId: Schema.Types.ObjectId,
        name: String,
        price: Number,
        shipping:{
            cost: Number,
            time: String
        },
        color: {type: String, default: ''},
        size: {type: String, default: ''},
        other: {type: String, default: ''}
    }],
    from:{
        city: String,
        state: String,
        zip: String,
    },
    to: {
        address1: String,
        address2: String,
        city: String,
        state: String,
        zip: String,
    },
    subtotal: Number,
    total: Number,
    tax: {type: Number, default: 0},
    buildTime: {type: String, default: ''},
    shipping:{
        cost: Number,
        time: String,
        weight: String
    },
    status: {type: String, defualt: 'Received'},
    created: {type: Date, default: Date.now},
    updated: {type: Date, default: Date.now}
})

module.exports = mongoose.model('Order', OrderSchema, 'Orders');