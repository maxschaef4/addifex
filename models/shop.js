var mongoose = require('mongoose');
var Schema = mongoose.Schema;

//User schema atrributes
var ShopSchema = new Schema({
    creatorId: Schema.Types.ObjectId,
    shopName: String,
    about: String,
    category: String,
    keywords: [String],
    products: [Schema.Types.ObjectId],
    shipping: {
        line1: String,
        line2: String,
        city: String,
        state: String,
        zip: String,
    },
    billing: {
        line1: String,
        line2: String,
        city: String,
        state: String,
        zip: String,
    },
    account: {
        created: {type: Date, default: Date.now},
        updated: {type: Date, default: Date.now},
        verified: {type: Boolean, defualt: false}
    }
})

module.exports = mongoose.model('Shop', ShopSchema, 'Shops');