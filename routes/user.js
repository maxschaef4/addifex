var router = require('express').Router();
var User = require('../models/user')
var cookieSession = require('cookie-session');

router.get('/signup', function(req, res){
    res.render('signup', {layout: 'simple.handlebars'});
})

router.post('/signup', function(req, res){
    var user = new User();
    
    user.name = req.body.name;
    user.email = req.body.email;
    user.password = req.body.password;
    
    User.findOne({email: req.body.email}, function(err, existingUser){
        if (existingUser) {
            console.log('User exists!!');
            
            return res.redirect('/signup');
        }else{
            user.save(function(err, user){
                if (err) return next(err);
                
                res.json('User has been created');
            })
        }
    })
})

router.get('/signin', function(req, res){
    res.render('signin', {status: '', layout: 'simple.handlebars'});
})

//router.get('/account', function(req, res){
//    var message = '';
//    
//    if (!req.session.user) {
//        message = 'Please sign in!';
//        res.render('account', {status: message});
//    }else{
//        db.collection('testCreator').find(ObjectId(req.session.user)).toArray(function(err, result){
//            if (err) {
//                console.log(err);
//            }else{
//                console.log(result[0]);
//                
//                message = 'Welcome ' + result[0].name + '!';
//                
//                res.render('account', {signedIn: checkSignin(req.session.user), creator: result[0]});
//            }
//        })
//    }
//})
        
router.get('/notifications', function(req, res){
    res.render('notifications');
})

module.exports = router;