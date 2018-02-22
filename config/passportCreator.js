const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const Creator = require('../models/user.js');

passport.serializeUser(function(creator, done){
    done(null, creator._id);
})

passport.deserializeUser(function(id, done){
    Creator.findById(id, function(err, creator){
        done(err, creator);
    })
})

passport.use('local', new LocalStrategy({usernameField: 'email', passReqToCallback: true,}, function(req, username, password, done){
        Creator.findOne({email: username}, function(err, creator){
            if (err) return done(err);
            
            if (!creator) {
                return done(null, false, req.flash('success', 'No creator has been found'));
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
    
    res.redirect('/creatorLogin');
}