const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const User = require('../models/user.js');
const Creator = require('../models/creator.js');

passport.serializeUser(function(user, done){
    
    var key = {
        id: user._id,
        type: user.account.type
    }
    
    done(null, key);
})

passport.deserializeUser(function(key, done){
    
    var Model = key.type === 'user' ? User : Creator;
    
    Model.findById(key.id, function(err, user){
        if (err) return done(err, null);
        if (!user) return done(err, null);
        if (user.length == 0) return done(err, null);
        
        done(err, {id: user._id, type: key.type});
    })
})

passport.use('user', new LocalStrategy({usernameField: 'email', passReqToCallback: true,}, function(req, username, password, done){
    User.find({email: username}, function(err, user){
        if (err) return done(err);
        
        if (user.length == 0) {
            return done(null, false, req.flash('user', 'No user has been found'));
        }
        
        user[0].comparePassword(password, function(res){
            if (!res) {
                return done(null, false, req.flash('user', 'Your password is incorrect'));
            }else{
                return done(null, user[0]);
            }
        })
    })
}))

passport.use('creator', new LocalStrategy({usernameField: 'email', passReqToCallback: true,}, function(req, username, password, done){
    Creator.find({email: username}, function(err, creator){
        if (err) return done(err);
        
        if (creator.length == 0) {
            return done(null, false, req.flash('creator', 'No user has been found'));
        }
        
        creator[0].comparePassword(password, function(res){
            if (!res) {
                return done(null, false, req.flash('creator', 'Your password is incorrect'));
            }else{
                return done(null, creator[0]);
            }
        })
    })
}))

exports.isAuthenticated = function(req, res, next){
    if (req.isAuthenticated()) {
        return next();
    }
}