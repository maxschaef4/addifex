var mongoose = require('mongoose');
var bcrypt = require('bcrypt-nodejs');
var Schema = mongoose.Schema;

//User schema atrributes
var UserSchema = new Schema({
    name: String,
    email: {type: String, unique: true, lowercase: true},
    password: String,
    shipping: {
        line1: {type: String, default: ''},
        line2: {type: String, default: ''},
        city: {type: String, default: ''},
        state: {type: String, default: ''},
        zip: {type: String, default: ''}
    },
    billing: {
        line1: {type: String, default: ''},
        line2: {type: String, default: ''},
        city: {type: String, default: ''},
        state: {type: String, default: ''},
        zip: {type: String, default: ''}
    },
    favorites: [Schema.Types.ObjectId],
    account: {
        created: {type: Date, default: Date.now},
        verified: {type: Boolean, default: false},
        type: {type: String, default: 'user'}
    },
})

//Hashing the password
UserSchema.pre('save', function(next){
    var user = this;
    if (!this.isModified('password')) return next();
    
    bcrypt.genSalt(10, function(err, salt){
        bcrypt.hash(user.password, salt, null, function(err, hash){
            if (err) return next(err);
            user.password = hash;
            next();
        })
    })
})

//Compare new password with old password
UserSchema.methods.comparePassword = function(password, done){
    bcrypt.compare(password, this.password, function(err, res){
        if (err) return callback(err, null);
        return done(res)
    })
}

UserSchema.methods.updateFavs = function(productId, done){
    for(var i = 0; i < this.favorites.length; i++){
        if (this.favorites[i].equals(productId)) return done(false);
    }
    
    this.favorites.push(productId);
    
    return done(true);
}

module.exports = mongoose.model('User', UserSchema, 'Users');