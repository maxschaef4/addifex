//This JavaScript file is based on the Node/Express book. This may be the working server script for the developed site.
//This is the main server for the site. This handles the routing.

//Getting and starting express
var express = require('express');
var app = express();

//Handlebars support
var handlebars = require('express-handlebars').create({defaultLayout: 'main'});
app.engine('handlebars', handlebars.engine);
app.set('view engine', 'handlebars');

//Custom modules
var scooby = require('./lib/scooby.js');

//Gets static files
app.use(express.static(__dirname + '/public'));

//Enables the explicit view of the cache
app.set('view cache', true);

//Sets the port to 8081
app.set('port', process.env.PORT || 8081);

//Testing Example
app.use(function(req, res, next){
    res.locals.showTests = app.get('env') !== 'production' && req.query.test === '1';
    
    next();
});

//For using cookies
var credentials = require('./credentials.js');
//Using cookie-parser middleware
app.use(require('cookie-parser')(credentials.cookieSecret));

//Using body-parser middleware
app.use(require('body-parser').urlencoded({extended: true}));

//------Partials Here--------

//Weather Widget
function getWeatherData() {
    return{
        locations: [
            {
                name: 'Portland',
                forecastUrl: 'http://www.wunderground.com/US/OR/Portland.html',
                iconUrl: 'http://icons-ak.wxug.com/i/c/k/cloudy.gif',
                weather: 'Overcast',
                temp: '54.1 F (12.3 C)',
            },
            {
                name: 'Bend',
                forecastUrl: 'http://www.wunderground.com/US/OR/Bend.html',
                iconUrl: 'http://icons-ak.wxug.com/i/c/k/partlycloudy.gif',
                weather: 'Partly Cloudy',
                temp: '55.0 F (12.8 C)',
            },
            {
                name: 'Manzanita',
                forecastUrl: 'http://www.wunderground.com/US/OR/Manzanita.html',
                iconUrl: 'http://icons-ak.wxug.com/i/c/k/rain.gif',
                weather: 'Shit Load Of Rain',
                temp: '55.0 F (12.8 C)',
            },
        ],
    };
}

app.use(function(req, res, next){
    if (!res.locals.partials) res.locals.partials = {};
    res.locals.partials.weatherContext = getWeatherData();
    next();
})

//-------Views go down here--------

//Home page
app.get('/', function(req, res){
    res.cookie('id', '123456789', {maxAge: 500000, signed: true, httpOnly: true});
    res.render('index', {scooby : scooby.getScooby(), name: 'Max',});
});

//About Page
app.get('/about', function(req, res){
    res.render('about', {
        pageTestScript : '/qa/tests-about.js'
    });
});

app.get('/signup', function(req, res){
    res.render('signup');
})

//Product Page
app.get('/product', function(req, res){
    res.render('product');
})

app.get('/newsletter', function(req, res){
    res.render('newsletter', {csrf: 'CSRF Token Goes Here'});
})

app.post('/process', function(req, res){
    console.log('Form: ' + req.query.form);
    console.log('CSRF Token: ' + req.body._csrf);
    console.log('Name: ' + req.body.name);
    console.log('Email: ' + req.body.email);
    res.redirect(303, '/thank-you');
})

//--------Error views go below this------

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

function startServer() {
    //Starts the server at port 8081
    app.listen(app.get('port'), function(){
        console.log('Express started on http://127.0.0.1:' + app.get('port'));
    });
}

if (require.main === module) {
    startServer();
}else{
    module.exports = startServer;
}