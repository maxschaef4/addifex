var router = require('express').Router();
var Category = require('../models/category');
var User = require('../models/user');

router.get('/category', function(req, res, next){
    Category.find({}, function(err, results){
        if (err) return next(err);
        res.render('category', {layout: 'simple.handlebars', message: req.flash('success'), categories: results});
    })
})

router.post('/category', function(req, res, next){
    var category = new Category();
    
    Category.findOne({name: req.body.name}, function(err, exist){
        if (err) return next(err);
        
        if (exist) {
            req.flash('success', 'Category already exists');
            return res.redirect('/admin/category');
        }
        category.name = req.body.name;
    
        category.save(function(err){
            if (err) return next(err);
            req.flash('success', 'Category successfully added');
            return res.redirect('/admin/category');
        })
    })
})

router.get('/users', function(req, res, next){
    User.find({}, function(err, results){
        if (err) return next(err);
        res.render('users', {layout: 'simple.handlebars', users: results});
    })
})

module.exports = router;