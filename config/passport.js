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
        done(err, user);
    })
})

passport.use('user', new LocalStrategy({usernameField: 'email', passReqToCallback: true,}, function(req, username, password, done){
    User.findOne({email: username}, function(err, user){
        if (err) return done(err);
        
        if (!user) {
            return done(null, false, req.flash('success', 'No user has been found'));
        }
        
        user.comparePassword(password, function(res){
            if (!res) {
                return done(null, false, req.flash('success', 'Your password is incorrect'));
            }else{
                return done(null, user);
            }
        })
    })
}))

passport.use('creator', new LocalStrategy({usernameField: 'email', passReqToCallback: true,}, function(req, username, password, done){
    Creator.findOne({email: username}, function(err, creator){
        if (err) return done(err);
        
        if (!creator) {
            return done(null, false, req.flash('success', 'No user has been found'));
        }
        
        creator.comparePassword(password, function(res){
            if (!res) {
                return done(null, false, req.flash('success', 'Your password is incorrect'));
            }else{
                return done(null, creator);
            }
        })
    })
}))

exports.isAuthenticated = function(req, res, next){
    if (req.isAuthenticated()) {
        return next();
    }
}