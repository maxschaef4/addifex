var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var OrderSchema = new Schema({
    buyer: Schema.Types.ObjectId,
    creator:{
        id: Schema.Types.ObjectId,
        name: String,
    },
    product: {
        productId: Schema.Types.ObjectId,
        name: String,
        price: Number,
        size: {type: String, default: ''},
        color: {type: String, default: ''},
        other: {type: String, default: ''}
    },
    from:{
        city: String,
        state: String,
        zip: String,
    },
    to: {
        line1: String,
        line2: String,
        city: String,
        state: String,
        zip: String,
    },
    subtotal: Number,
    shipping:{
        cost: Number,
        time: String,
        weight: String
    },
    tax: {type: Number, default: 0},
    total: Number,
    buildTime: {type: String, default: ''},
    status: {type: String, defualt: 'Received'},
    created: {type: Date, default: Date.now},
    updated: {type: Date, default: Date.now}
})

//add a method for calculating the tax on the order
//refer to the user method ComparePassword and HashPassword

module.exports = mongoose.model('Order', OrderSchema, 'Orders');