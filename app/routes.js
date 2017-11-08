var express = require('express');
var router = express.Router();

router.get('/', function(req, res, next){
    res.render('index');
    next();
})

module.exports = router;

//router.get('/', function(req, res, next){
//        db.collection('testCreator').find({}).toArray(function(err, result){
//            if (err) {
//                console.log(err);
//            }
//            
//            console.log('showing users');
//            
//            creators = result;
//        })
//        
//        next();
////This callback returns the products to be displayed on the index page in the featured/popular/newest section  
//}, function(req, res){
//    db.collection('testProducts').find({}).toArray(function(err, result){
//        if (err) {
//            console.log(err);
//        }else{
//            console.log('Showing products');
//            
//            products = result;
//            
//            res.render('index', {scooby : scooby.getScooby(), cart: getCartContent.countCart(req.session.cart), users: creators, products: products});
//        }
//    })
//})

