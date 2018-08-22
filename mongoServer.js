//Author: Maxwell Schaefer
//Date: 2/7/2018

const express = require('express');
const app = express();
const mongoose = require('mongoose');
//DO NOT REMOVE LINE IF FORGET
//FIXES AN ERROR WITH AN INTERNAL MONGOOSE FUNCTION
mongoose.plugin(schema => { schema.options.usePushEach = true });
mongoose.set('debug', true);
////Handlebars support
const handlebars = require('express-handlebars').create({
    //Defines the name of the default layout file
    defaultLayout: 'main',
    helpers: {
        //Sections can be used for page specific elements
        section: function (name, options) {
            if (!this._sections) {
                this._sections = {};
            }
            this._sections[name] = options.fn(this);
            return null;
        },
        flashMessage: function(message, color){
            //generates flash messages
            return '<div class="notice ' + color.split("").join("") + ' col-12"><center>' + message + '</center></div>'
        }
    }
})

var session = require('express-session');
var cookieParser = require('cookie-parser');
var flash = require('express-flash');
const mongoStore = require('connect-mongo')(session);
const passport = require('passport');
//Development
const morgan = require('morgan');

var secret = require('./config/secret.js');

//gets routes
var mainRoutes = require('./routes/main');
var userRoutes = require('./routes/user');
var cartRoutes = require('./routes/cart');
var creatorRoutes = require('./routes/creator');
var shopRoutes = require('./routes/shop');
var productRoutes = require('./routes/product');
var orderRoutes = require('./routes/orders');
var guestRoutes = require('./routes/guest');
var imagesRoutes = require('./routes/images');
var adminRoutes = require('./routes/admin');

//Custom Middleware
var cartMw = require('./mw/cart');

//Using body-parser middleware
//Gets image, script, styles, and vendor files from /public
app.use(express.static(__dirname + '/public'));
app.use(cookieParser());
app.use(require('body-parser').urlencoded({extended: true}));
app.use(session({
    resave: false,
    saveUninitialized: false,
    secret: secret.secretKey,
    store: new mongoStore({url: secret.database, autoReconnect: true}),
    cookie: {
        originalMaxAge: 1000 * 60 * 60 * 24
    }
}))
app.use(morgan('dev'));
app.use(flash());
app.use(passport.initialize());
app.use(passport.session());

//allows user to be accessed by all routes
app.use(function(req, res, next){
    if (req.user) {
        res.locals.user = req.user.id;
    }else{
        res.locals.user = null;
    }
    next();
})

app.use(cartMw.gettingInfo);
app.use(cartMw.unsignedCart);

//Uses the routes middleware
app.use(mainRoutes);
app.use(userRoutes);
app.use(cartRoutes);
app.use(creatorRoutes);
app.use(shopRoutes);
app.use(productRoutes);
app.use(orderRoutes);
app.use(guestRoutes);
app.use(imagesRoutes);
app.use('/admin', adminRoutes);
//testing purposes
var testRoutes = require('./routes/imageTest');
app.use(testRoutes);

app.engine('handlebars', handlebars.engine);
app.set('view engine', 'handlebars');

mongoose.connect(secret.database, function(err){
    if (err) {
        console.log(err);
    }else{
        console.log('Connect to DB Successful');
    }
})

mongoose.Promise = global.Promise;

//Get the default connection
var db = mongoose.connection;

//Bind connection to error event (to get notification of connection errors)
db.on('error', console.error.bind(console, 'MongoDB connection error:'));

/*******
 *Error Pages
 */

//500 page
//app.use(function(req, res){
//    res.status(500);
//    res.render('500', {layout: 'simple.handlebars'});
//});

//404 page
app.use(function(req, res){
    res.status(404);
    res.render('404', {layout: 'simple.handlebars'});
});

//403 page
app.use(function(req, res){
    res.status(403);
    res.render('403', {layout: 'simple.handlebars'});
})

app.listen(secret.port, function(err){
    if (err) {
        throw err;
    }
    
    console.log('Server running on ::' + secret.port);
})