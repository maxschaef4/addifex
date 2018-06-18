//Temporary file for solving full image upload functionality

var router = require('express').Router();
var async = require('async');
var fs = require('fs');
const { Readable } = require('stream');
var formidable = require('formidable');
var Creator = require('../models/creator');
var Product = require('../models/product');

router.get('/image-upload', function(req, res, next){
    res.render('image-upload');
})

router.post('/image-upload', function(req, res, next){
    let product = new Product();
    
    let path = __dirname.substring(0, __dirname.indexOf('/routes')) + '/tmp/' + req.user._id + '/' + product._id;
    
    
})

//router.post('/image-upload', function(req, res, next){
//    var product = new Product();
//    
//    var form = new formidable.IncomingForm();
//    form.multiple = true;
//    var path = __dirname.substring(0, __dirname.indexOf('/routes')) + '/tmp/' + req.user._id + '/' + product._id;
//    
//    Creator.find({_id: req.user._id}, function(err, creator){
//        if (err) return next(err);
//        
//        if (!creator[0]) {
//            req.flash('creator', 'Product failed to be uploaded');
//            res.redirect('/dashboard-products-new');
//            next();
//        }
//        async.waterfall([
//            function(callback) {
//                fs.mkdir(path, function(err){
//                    if (err) return next(err);
//                })
//                
//                form.on('fileBegin', function(name, file){
//                    file.path = path + '/' + file.name;
//                })
//                
//                form.parse(req, function(err, fields, files){
//                    product.name = fields.name;
//                    product.info.creatorId = req.user._id;
//                    
//                    callback(null);
//                })
//            },
//            function(callback) {
//                creator[0].products.push(product._id);
//                
//                //updates the creators date to upload time
//                //creator.account.updated = new Date();
//                
//                creator[0].save(function(err){
//                    if (err) return next(err);
//                })
//                
//                product.save(function(err){
//                    if (err) return next(err);
//                    req.flash('creator', 'Product added successfully');
//                    callback(res.redirect('/imageTest/' + product._id));
//                })
//            }
//        ])
//    })
//})

router.get('/imageTest/:id', function(req, res, next){
    
    let path = __dirname.substring(0, __dirname.indexOf('/routes')) + '/tmp/' + req.user._id + '/' + req.params.id;
    
    const readStream = new Readable({
        
    })
    
    async.waterfall([
        function(callback) {
            fs.readdir(path, function(err, files){
                if (err) return next(err);
                
                imageCount = files.length;
                
                async.each(files, function(file, callback){
                    
                    var loc = path + '/' + file;
                    
                    readStream.push(file);
                    callback();
                    
                    //fs.readFile(loc, function(err, img){
                    //    if (err) return next(err);
                    //    
                    //    data.push(img.toString('base64'));
                    //    callback();
                    //})
                }, function(err){
                    if (err) return next(err);
                    
                    //closes the stream by pushing a null object
                    readStream.push(null);
                    readStream.pipe(res);
                    res.render('imageTest', {layout: 'simple.handlebars'});
                })
            })
        },
        
    ])
})

module.exports = router;