var mongoose = require('mongoose');
var bcrypt = require('bcrypt-nodejs');
var Schema = mongoose.Schema;

//User schema atrributes
var UserSchema = new Schema({
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
        console.log(res);
        return done(res)
    })
}

module.exports = mongoose.model('User', UserSchema, 'Users');