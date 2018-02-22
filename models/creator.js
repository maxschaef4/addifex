var mongoose = require('mongoose');
var bcrypt = require('bcrypt-nodejs');
var Schema = mongoose.Schema;

//User schema atrributes
var CreatorSchema = new Schema({
    name: {type: String, default: ''},
    email: {type: String, unique: true, lowercase: true},
    password: String,
    address: {
        line1: String,
        line2: String,
        city: String,
        state: String,
        zip: Number,
    },
    shopName: {type: String, unique: true},
    about: String,
    category: String,
    keywords: [String],
    locals: String,
    products: [Schema.Types.ObjectId],
    account: {
        created: {type: Date, default: Date.now},
        updated: {type: Date, default: Date.now},
        verified: {type: Boolean, default: false},
        type: {type: String, default: 'creator'}
    }
})

//Hashing the password
CreatorSchema.pre('save', function(next){
    var creator = this;
    if (!this.isModified('password')) return next();
    
    bcrypt.genSalt(10, function(err, salt){
        bcrypt.hash(creator.password, salt, null, function(err, hash){
            if (err) return next(err);
            creator.password = hash;
            next();
        })
    })
})

//Compare new password with old password
CreatorSchema.methods.comparePassword = function(password, done){
    bcrypt.compare(password, this.password, function(err, res){
        if (err) return callback(err, null);
        return done(res)
    })
}

module.exports = mongoose.model('Creator', CreatorSchema, 'Creators');