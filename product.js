var express = require('express');
var router = express.Router();

router.get('/product/:id', function(req, res){
    db.collection('testProducts').find(ObjectId(req.params.id)).toArray(function (err, result){
        if (err) {
            console.log(err);
        }else{
            console.log(result[0]);
            
            res.render('product', {product: result[0]});
        }
    })
})

router.post('/product/:id', function(req, res){
    if (req.session.cart) {
        req.session.cart.push(req.body.product);
    }else{
        var content = [req.body.product];
        
        req.session.cart = content;
    }
    
    res.render('product');
})

module.exports = router;