var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var ProductSchema = new Schema({
    name: {type: String},
    price: Number,
    shipping: {
        cost: Number,
        time: String,
        weight: Number
    },
    description: String,
    buildTime: String,
    options: {
        colors: [String],
        sizes: [String],
        others: [String]
    },
    category: String,
    keywords: [String],
    info: {
        shopId: {type: Schema.Types.ObjectId, ref: 'Shop'},
        created: {type: Date, default: Date.now},
        updated: {type: Date, default: Date.now},
        verified: {type: Boolean, default: false}
    }
})

module.exports = mongoose.model('Product', ProductSchema, 'Products');