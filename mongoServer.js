//Connecting to MongoDB cluster1
const mongoClient = require('mongodb').MongoClient;
//Gives me access to the auto-generated id for being able to find users by id
const ObjectId = require('mongodb').ObjectID;
const assert = require('assert');
//Used for MongoDB Atlas--Add later
//var uri = "mongodb://maxwell-schaefer:Cluster1Passwrd@cluster1-shard-00-00-gagz1.mongodb.net:27017,cluster1-shard-00-01-gagz1.mongodb.net:27017,cluster1-shard-00-02-gagz1.mongodb.net:27017/Addifex?ssl=true&replicaSet=Cluster1-shard-0&authSource=admin";
const host = 'mongodb://localhost:27017/test';
//Getting and starting express on port 8081
const express = require('express');
const app = express();
const port = process.env.port || 8081;
//Used for overriding HTTP verbs...specifically for delete and put methods
const methodOverride = require('method-override');
//Handlebars support
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
        }
    }
})
const mongoose = require('mongoose');
//Client Sessions automatically encypts the cookies
const session = require('client-sessions');
//File Upload Variables
const fs = require('fs');
const multer = require('multer');
//var storage = multer.diskStorage({
//    destination: function(req, file, cb){
//        cb(null, '/public/product-photos/');
//    },
//    filename: function(req, file, cb){
//        cb(null, file.originalname);
//    }
//})
const upload = multer({ dest: 'creator-images/'});
var User = require('./models/user.js');
//Development
const morgan = require('morgan');
//Custom modules
const scooby = require('./lib/scooby.js');
const getCartContent = require('./lib/cartContent.js');

// override with different headers; last one takes precedence
app.use(methodOverride('_method'));
//Using body-parser middleware
app.use(require('body-parser').urlencoded({extended: true}));
app.engine('handlebars', handlebars.engine);
app.set('view engine', 'handlebars');
//cookie for storing the user session
app.use(
    session({
        cookieName: 'session',
        secret: 'I guess a random string goes here',
        duration: 24 * 60 * 60 * 1000,
        activeDuration: 60 * 60 * 1000,
    })
)

//Gets image, script, styles, and vedor files from /public
app.use(express.static(__dirname + '/public'));
app.use(morgan('dev'));

//gets routes
var mainRoutes = require('./routes/main');
var userRoutes = require('./routes/user');

app.use(mainRoutes);
app.use(userRoutes);

mongoose.connect('mongodb://maxschaefer:TheSiteMaker1@ds163836.mlab.com:63836/addifex', function(err){
    if (err) {
        console.log(err);
    }else{
        console.log('Connect to DB Successful');
    }
})

app.listen('3000', function(err){
    if (err) {
        throw err;
    }
    
    console.log('Server running on ::3000')
})

//mongoClient.connect(host, function(err, db){
//    if (err) {
//        console.log('Returned from MongoClient: ' + err);
//    }else{
//    
//        assert.equal(null, err);
//        console.log('Successful connection to Mongo Server');
//        
//        app.listen(port);
//        console.log('Listening on port: ' + port);
//        
//        var creators, products;
//        
//        //Renders the index page
//        //Gets all the numbers in the testCollection collection
//        //Gets all the creators in the testCreator collection
//        app.get('/', function(req, res, next){
//            db.collection('testCreator').find({}).toArray(function(err, result){
//                if (err) {
//                    console.log(err);
//                }
//                
//                creators = result;
//            })
//            
//            next();
//        //This callback returns the products to be displayed on the index page in the featured/popular/newest section  
//        }, function(req, res){
//            db.collection('testProducts').find({}).toArray(function(err, result){
//                if (err) {
//                    console.log(err);
//                }else{
//                    products = result;
//                    
//                    res.render('index', {scooby : scooby.getScooby(), cart: getCartContent.countCart(req.session.cart), signedIn: checkSignin(req.session.user), users: creators, products: products});
//                }
//            })
//        })
//        
//        app.get('/search/:query', function(req, res){
//            var query;
//            
//            if (req.params.query && req.body.search) {
//                query = req.body.search;
//            }else if(req.params.query){
//                query = req.params.query;
//            }else{
//                query = req.body.search;
//            }
//            
//            db.collection('testProducts').find({name: query}).toArray(function(err, result){
//                   if (err) {
//                    console.log(err);
//                   }else{
//                    console.log(result);
//                    
//                    res.render('search', {products: result});
//                   }
//            })
//        })
//        
//        app.post('/search/:query', function(req, res){
//            var query;
//            
//            if (req.params.query && req.body.search) {
//                query = req.body.search;
//            }else if(req.params.query){
//                query = req.params.query;
//            }else{
//                query = req.body.search;
//            }
//            
//            db.collection('testProducts').find({name: query}).toArray(function(err, result){
//                   if (err) {
//                    console.log(err);
//                   }else{
//                    console.log(result);
//                    
//                    res.render('search', {products: result});
//                   }
//            })    
//        })
//        
//        app.get('/signup', function(req, res){
//            res.render('signup', {layout: 'simple.handlebars'});
//        })
//        
//        //Used for signing up a new creator
//        app.post('/signup', function(req, res){
//            var info = {name: req.body.name, email: req.body.email, password: req.body.password};
//            
//            db.collection('testCreator').insertOne(info, function(err, result) {
//                if(err){
//                    console.log(err);
//                }
//                
//                req.session.user = info._id;
//                
//                console.log(newInfo);
//                
//                res.redirect('account');
//            });
//        });
//        
//        app.post('/signin', function(req, res){
//            var getSigninInfo = {email: req.body.email, password: req.body.password};
//            
//            db.collection('testCreator').find(getSigninInfo).toArray(function(err, result){
//                if (err) {
//                    console.log(err);
//                }
//                
//                var message;
//                
//                console.log(result[0]);
//                
//                if (!result[0]) {
//                    message = 'Email/Password are incorrect you fucking stupid little bitch';
//                }else{
//                    req.session.user = result[0]._id;
//                    
//                    message = 'Welcome to Addifex Bitch!!!!!!!!!!!!' + result[0]._id;
//                }
//                
//                res.render('signin', {layout: 'simple.handlebars', status: message});
//            })
//        })
//        
//        app.get('/account', function(req, res){
//            var message = '';
//            
//            if (!req.session.user) {
//                message = 'Please sign in!';
//                res.render('account', {status: message});
//            }else{
//                db.collection('testCreator').find(ObjectId(req.session.user)).toArray(function(err, result){
//                    if (err) {
//                        console.log(err);
//                    }else{
//                        console.log(result[0]);
//                        
//                        message = 'Welcome ' + result[0].name + '!';
//                        
//                        res.render('account', {signedIn: checkSignin(req.session.user), creator: result[0]});
//                    }
//                })
//            }
//        })
//        
//        app.get('/notifications', function(req, res){
//            res.render('notifications');
//        })
//        
//        var productsInCart;
//        
//        app.get('/cart', function(req, res){
//            if (req.session.cart) {
//                for(var i = 0; i < req.session.cart.length; i++)
//                    req.session.cart[i] = ObjectId(req.session.cart[i]);
//                
//                db.collection('testProducts').find({'_id': {$in: req.session.cart}}).toArray(function(err, result){
//                    if (err) {
//                        console.log(err);
//                    }else{
//                        productsInCart = result;
//                        
//                        res.render('cart', {cart: getCartContent.countCart(req.session.cart), products: result, message: '', signedIn: checkSignin(req.session.user)});
//                    }
//                })
//            }else{
//                res.render('cart', {cart: getCartContent.countCart(req.session.cart), message: 'Cart is Empty', signedIn: checkSignin(req.session.user)});
//            }
//        })
//        
//        app.post('/cart', function(req, res){
//            for(var i = 0; i < req.session.cart.length; i++){
//                if (req.body.productId == req.session.cart[i]) {
//                    req.session.cart.splice(i, 1);
//                }
//            }
//            
//            res.redirect('cart');
//        })
//        
//        var product;
//        
//        app.get('/product/:id', function(req, res){
//            db.collection('testProducts').find(ObjectId(req.params.id)).toArray(function (err, result){
//                if (err) {
//                    console.log(err);
//                }else{
//                    product = result[0];
//                    
//                    res.render('product', {product: product, inCart: getCartContent.inCart(req.session.cart, req.params.id)});
//                }
//            })
//        })
//        
//        app.post('/product/:id', function(req, res){
//            if (req.session.cart) {
//                req.session.cart.push(req.body.productId);
//            }else{
//                req.session.cart = [req.body.productId];
//            }
//            console.log(ObjectId(req.body.productId));
//            
//            console.log(req.session.cart);
//            
//            res.render('product', {product: product, inCart: getCartContent.inCart(req.session.cart, req.params.id)});
//        })
//        
//        app.get('shop/:id', function(req, res){
//            res.render('shop');
//        })
//        
//        app.get('/creatorLogin', function(req, res){
//            if (!req.session.creator) {
//                res.render('creatorLogin', {layout: 'simple.handlebars'});
//            }else{
//                res.redirect('/dashboard');
//            }
//        })
//        
//        app.post('/creatorLogin', function(req, res){
//            var creatorLogin = {email: req.body.email, password: req.body.password};
//            
//            db.collection('testCreators').find(creatorLogin).toArray(function(err, result){
//                if (err) {
//                    console.log(err);
//                }
//                
//                var message;
//                
//                if (!result[0]) {
//                    message = 'Email/Password are incorrect you fucking stupid little bitch';
//                    
//                    res.render('creatorLogin', {layout: 'simple.handlebars', status: message});
//                }else{
//                    req.session.creator = result[0]._id;
//                    
//                    res.redirect('dashboard');
//                }
//            })
//        })
//        
//        app.get('/creatorLogin-new', function(req, res){
//            res.render('creatorLogin-new', {layout: 'simple.handlebars', signedIn: checkSignin(req.session.creator)});
//        })
//        
//        app.post('/creatorLogin-new', upload.single('shopImage'), function(req, res, next){
//            
//            var info = {
//                fullName: req.body.fullName,
//                email: req.body.email,
//                password: req.body.password,
//                shipping: {
//                    address: req.body.address,
//                    city: req.body.city,
//                    state: req.body.state,
//                    zip: req.body.zip,
//                },
//                billing: {
//                    address: req.body.address,
//                    city: req.body.city,
//                    state: req.body.state,
//                    zip: req.body.zip,
//                },
//                shopName: req.body.shopName,
//                description: req.body.description,
//                category: req.body.category,
//                keywords: req.body.keywords,
//            }
//            
//            console.log(req.file.originalname);
//            
//            db.collection('testCreators').insertOne(info, function(err, result){
//                if (err) {
//                    console.log(err);
//                }else{
//                    
//                    req.session.creator = info._id;
//                    
//                    console.log(result);
//                    console.log("User Id: " + info._id);
//                    console.log("Session: " + req.session.creator)
//                    
//                    res.redirect('/dashboard');
//                }
//            })
//        })
//        
//        
//        //Use a get request parameter that gets all routes with the word 'dashboard' in it. Use reqexp.
//        
//        
//        app.get('/dashboard', function(req, res){
//            res.render('dashboard', {layout: 'simple.handlebars', signedIn: checkSignin(req.session.creator)});
//        })
//        
//        app.get('/dashboard-orders', function(req, res){
//            res.render('dashboard-orders', {layout: 'simple.handlebars', signedIn: checkSignin(req.session.creator)});
//        })
//        
//        app.get('/dashboard-products', function(req, res){
//            res.render('dashboard-products', {layout: 'simple.handlebars', signedIn: checkSignin(req.session.creator)});
//        })
//        
//        app.get('/dashboard-products-view', function(req, res){
//            
//            
//            res.render('dashboard-products-view', {layout: 'simple.handlebars', signedIn: checkSignin(req.session.creator)});
//        })
//        
//        app.get('/dashboard-products-new', function(req, res){
//            res.render('dashboard-products-new', {layout: 'simple.handlebars', signedIn: checkSignin(req.session.creator)});
//        })
//        
//        app.post('/dashboard-products-new', function(req, res){
//            
//            db.collection('testCreators').find(ObjectId(req.session.creator)).toArray(function(err, result){
//                if (err) {
//                    console.log(err);
//                }else{
//                    var shopName = result[0];
//                }
//            })
//            
//            var product = {
//                creatorId: req.session.creator,
//                creatorName: shopName,
//                name: req.body.name,
//                price: req.body.price,
//                shipping: {
//                    cost: req.body.shipCost,
//                    time: req.body.shipTime,
//                },
//                buildTime: req.body.buildTime,
//                description: req.body.description,
//                options: {
//                    colors: req.body.colors,
//                    sizes: req.body.sizes,
//                    other: req.body.other,
//                },
//                category: req.body.category,
//                keywords: req.body.keywords,
//            }
//            
//            db.collection('testProducts').insertOne(product, function(err, result){
//                if (err) {
//                    console.log(err);
//                }else{
//                    console.log(result)
//                    
//                    res.redirect('/dashboard-products-view');
//                }
//            })
//        }, function(req, res){
//            //insert the product id into the creators product array
//        })
//        
//        app.get('/dashboard-sales', function(req, res){
//            res.render('dashboard-sales', {layout: 'simple.handlebars', signedIn: checkSignin(req.session.creator)});
//        })
//        
//        app.get('/dashboard-edit', function(req, res){
//            if (req.session.creator) {
//                db.collection('testCreators').find(ObjectId(req.session.creator)).toArray(function(err, result){
//                    if (err) {
//                        console.log(err);
//                    }else{
//                        res.render('dashboard-edit', { creator: result[0], layout: 'simple.handlebars', signedIn: checkSignin(req.session.creator)});
//                    }
//                })
//            }else{
//                res.render('dashboard-edit', {layout: 'simple.handlebars', signedIn: checkSignin(req.session.creator)});
//            }
//        })
//        
//        app.get('/dashboard-info', function(req, res){
//            if (req.session.creator) {
//                db.collection('testCreators').find(ObjectId(req.session.creator)).toArray(function(err, result){
//                    if (err) {
//                        console.log(err);
//                    }else{
//                        res.render('dashboard-info', { creator: result[0], layout: 'simple.handlebars', signedIn: checkSignin(req.session.creator)});
//                    }
//                })
//            }else{
//                res.render('dashboard-info', {layout: 'simple.handlebars', signedIn: checkSignin(req.session.creator)});
//            }
//        })
//        
//        app.get('/dashboard-help', function(req, res){
//            res.render('dashboard-help', {layout: 'simple.handlebars'})
//        })
//        
//        //app.post('/image-upload', upload.single('userImage'), function(req, res, next){
//        //    console.log(req.file.originalname);
//        //    
//        //    respond = {
//        //        message:'File Upload Successful',
//        //        filename:req.file.originalname,
//        //        type:req.file.mimetype
//        //    };
//        //    
//        //    res.send({status: 'Good Upload'});
//        //});
//    }
//})