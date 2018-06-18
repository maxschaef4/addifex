//Author: Maxwell Schaefer
//Date: 2/7/2018

const express = require('express');
const app = express();
const mongoose = require('mongoose');
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
var productRoutes = require('./routes/product');
var adminRoutes = require('./routes/admin');

//Custom Middleware
var cartMw = require('./mw/cart');

//Using body-parser middleware
//Gets image, script, styles, and vendor files from /public
app.use(express.static(__dirname + '/public'));
app.use(cookieParser());
app.use(require('body-parser').urlencoded({extended: true}));
app.use(session({
    resave: true,
    saveUninitialized: true,
    secret: secret.secretKey,
    store: new mongoStore({url: secret.database, autoReconnect: true}),
    cookie: {
        originalMaxAge: 600000
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
app.use(productRoutes);
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

app.listen(secret.port, function(err){
    if (err) {
        throw err;
    }
    
    console.log('Server running on ::' + secret.port);
})