var mongoose = require('mongoose');
var bcrypt = require('bcrypt-nodejs');
var Schema = mongoose.Schema;

//User schema atrributes
var CreatorSchema = new Schema({
    name: {type: String, default: ''},
    email: {type: String, unique: true, lowercase: true},
    password: String,
    about: String,
    account: {
        created: {type: Date, default: Date.now},
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