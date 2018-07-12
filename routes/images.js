var router = require('express').Router();
var async = require('async');
var fs = require('fs');
var multi = require('multistream');
var Product = require('../models/product')

router.get('/images/productImages/:productId', function(req, res, next){
    Product.find({_id: req.params.productId}, function(err, product){
        let path = __dirname.substring(0, __dirname.indexOf('/routes')) + '/tmp/' + req.params.productId;
        
        fs.readdir(path, function(err, files){
            if (err) return next(err);
            
            var streams = [];
            
            for(var i = 0; i < files.length; i++){
                streams.push(fs.createReadStream(path +'/' + files[i], {encoding: 'hex'}));
            }
            
            multi(streams).pipe(res);
        })
    })
})

module.exports = router;