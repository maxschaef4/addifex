//Temporary file for solving full image upload functionality

var router = require('express').Router();
var async = require('async');
var fs = require('fs');
const { Readable, Writable } = require('stream');
var formidable = require('formidable');
var Creator = require('../models/creator');
var Product = require('../models/product');
var multi = require('multistream');

router.get('/image-upload', function(req, res, next){
    if (!req.user) {
        res.redirect('/dashboard/signin');
    }
    
    if (req.user.type == 'user') res.redirect('/dashboard/signin');
    
    res.render('test-imageUpload');
})

router.post('/image-upload', function(req, res, next){
    var product = new Product();
    
    var form = new formidable.IncomingForm();
    form.multiple = true;
    var path = __dirname.substring(0, __dirname.indexOf('/routes')) + '/tmp/' + req.user.id + '/' + product._id;
    
    Creator.find({_id: req.user.id}, function(err, creator){
        if (err) return next(err);
        
        if (!creator[0]) {
            req.flash('creator', 'Product failed to be uploaded');
            res.redirect('/dashboard/products/new');
            next();
        }
        async.waterfall([
            function(callback) {
                fs.mkdir(path, function(err){
                    if (err) return next(err);
                })
                
                form.on('fileBegin', function(name, file){
                    file.path = path + '/' + file.name;
                })
                
                form.parse(req, function(err, fields, files){
                    product.name = fields.name;
                    product.info.creatorId = req.user._id;
                    
                    callback(null);
                })
            },
            function(callback) {
                callback(res.redirect('/imageTest/' + product._id));
            }
        ])
    })
})

router.get('/imageTest/:id', function(req, res){
    res.render('test-imageShow', {layout: 'simple.handlebars', id: req.params.id});
})

router.get('/test/imageTest/:id', function(req, res, next){
    
    let path = __dirname.substring(0, __dirname.indexOf('/routes')) + '/tmp/' + req.user.id + '/' + req.params.id;
    
    fs.readdir(path, function(err, files){
        if (err) return next(err);
        
        var streams = [];
        
        for(var i = 0; i < files.length; i++){
            streams.push(fs.createReadStream(path +'/' + files[i], {encoding: 'hex'}));
        }
        
        multi(streams).pipe(res);
    }) 
})

module.exports = router;