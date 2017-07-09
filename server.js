//This JavaScript file is based on the Node/Express book. This may be the working server script for the developed site.
//This is the main server for the site. This handles the routing.

//Variables for importing modules
var express = require('express');
var handlebars = require('express-handlebars').create({defaultLayout : 'main'});
//Custom modules
var scooby = require('./lib/scooby.js');

var app = express();

//Handlebars support
app.engine('handlebars', handlebars.engine);
app.set('view engine', 'handlebars');

app.use(express.static(__dirname + '/public'));

app.set('port', process.env.PORT || 8081);

app.use(function(req, res, next){
    res.locals.showTests = app.get('env') !== 'production' && req.query.test === '1';
    
    next();
});

//Home page
app.get('/', function(req, res){
    res.render('index');
});

//About Page
app.get('/about', function(req, res){
    res.render('about', {scooby : scooby.getScooby()});
});

//404 page
app.use(function(req, res){
    res.status(404);
    res.render('404');
});

//500 page
app.use(function(err, req, res, next){
    console.error(err.stack);
    res.status(500);
    res.render('500');
});

app.listen(app.get('port'), function(){
    console.log('Express started on http://127.0.0.1:' + app.get('port'));
});