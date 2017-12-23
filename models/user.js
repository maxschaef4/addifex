var mongoose = require('mongoose');
var bcrypt = require('bcrypt-nodejs');

//User schema atrributes
var UserSchema = new mongoose.Schema({
    name: {type: String, default: ''},
    email: {type: string, unique: true, lowercase: true},
    password: String,
    address: {
        line1: String,
        line2: String,
        city: String,
        state: String,
        zip: Number,
    },
    history: [{
        date: Date,
        paid: {type: Number, default: 0},
    }],
})

//Hashing the password
UserSchema.pre('save', function(next){
    if (!this.isModified('password')) return next();
    bcrypt.genSalt(10, function(err, salt){
        if (err) return next(err);
        bcrypt.hash(this.password, salt, null, function(err, hash){
            if (err) return next(err);
            user.password = hash;
            next();
        })
    })
})

//Compare new password with old password
UserSchema.methods.comparePassword = function(password){
    return bcrypt.compareSync(password, this.password);
}

module.exports = mongoose.model('User', UserSchema);