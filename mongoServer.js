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
const upload = multer({ dest: 'public/product-photos/'});
const routes = require('./app/routes.js');
//used for parsing and getting dynamically generated pages
const url = require('url');
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
//cookie for storing cart details...active for 24 hours
app.use(
    session({
        cookieName: 'cart',
        secret: 'Not sure yet',
        duration: 24 * 60 * 60 * 1000,
        activeDuration: 60 * 60 * 1000,
    })
)
//Gets image, script, styles, and vedor files from /public
app.use(express.static(__dirname + '/public'));

//gets routes
//app.use('/', router);

//--------Partials Go Below Here-------


//-------Helper functions go below here------

function checkSignin(session) {
    if (!session) {
        return false;
    }else{
        return true;
    }
}

mongoClient.connect(host, function(err, db){
    if (err) {
        console.log('Returned from MongoClient: ' + err);
    }else{
    
        assert.equal(null, err);
        console.log('Successful connection to Mongo Server');
        
        app.listen(port);
        console.log('Listening on port: ' + port);
        
        var collie = db.collection('testCollection');
        
        var creators, products;
        
        //Renders the index page
        //Gets all the numbers in the testCollection collection
        //Gets all the creators in the testCreator collection
        app.get('/', function(req, res, next){
            db.collection('testCreator').find({}).toArray(function(err, result){
                if (err) {
                    console.log(err);
                }
                
                console.log('showing users');
                
                creators = result;
            })
            
            next();
        //This callback returns the products to be displayed on the index page in the featured/popular/newest section  
        }, function(req, res){
            db.collection('testProducts').find({}).toArray(function(err, result){
                if (err) {
                    console.log(err);
                }else{
                    console.log('Showing products');
                    
                    products = result;
                    
                    res.render('index', {scooby : scooby.getScooby(), cart: getCartContent.countCart(req.session.cart), signedIn: checkSignin(req.session.user), users: creators, products: products});
                }
            })
        })
        
        app.get('/search/:query', function(req, res){
            var query;
            
            if (req.params.query && req.body.search) {
                query = req.body.search;
            }else if(req.params.query){
                query = req.params.query;
            }else{
                query = req.body.search;
            }
            
            db.collection('testProducts').find({name: query}).toArray(function(err, result){
                   if (err) {
                    console.log(err);
                   }else{
                    console.log(result);
                    
                    res.render('search', {products: result});
                   }
            })
        })
        
        app.post('/search/:query', function(req, res){
            var query;
            
            if (req.params.query && req.body.search) {
                query = req.body.search;
            }else if(req.params.query){
                query = req.params.query;
            }else{
                query = req.body.search;
            }
            
            db.collection('testProducts').find({name: query}).toArray(function(err, result){
                   if (err) {
                    console.log(err);
                   }else{
                    console.log(result);
                    
                    res.render('search', {products: result});
                   }
            })    
        })
        
        app.get('/signup', function(req, res){
            res.render('signup');
        })
        
        //Used for signing up a new creator
        app.post('/signup', function(req, res){
            var newInfo = {name: req.body.name, email: req.body.email, password: req.body.password};
            
            db.collection('testCreator').insertOne(newInfo, function(err, result) {
                if(err){
                    console.log(err);
                }
                
                req.session.user = newInfo._id;
                
                console.log(newInfo);
                
                res.redirect('account');
            });
        });
        
        app.get('/signin', function(req, res){
            res.render('signin', {status: ''});
        })
        
        app.post('/signin', function(req, res){
            var getSigninInfo = {email: req.body.email, password: req.body.password};
            
            db.collection('testCreator').findOne(getSigninInfo, function(err, result){
                if (err) {
                    console.log(err);
                }
                
                var message;
                
                console.log(result);
                
                if (!result) {
                    message = 'Email/Password are incorrect you fucking stupid little bitch';
                }else{
                    req.session.user = result._id;
                    
                    message = 'Welcome to Addifex Bitch!!!!!!!!!!!!' + result._id;
                }
                
                res.render('signin', {status: message});
            })
        })
        
        app.get('/account', function(req, res){
            var message = '';
            
            if (!req.session.user) {
                message = 'Please sign in!';
                res.render('account', {status: message});
            }else{
                db.collection('testCreator').find(ObjectId(req.session.user)).toArray(function(err, result){
                    if (err) {
                        console.log(err);
                    }else{
                        console.log(result[0]);
                        
                        message = 'Welcome ' + result[0].name + '!';
                        
                        res.render('account', {signedIn: checkSignin(req.session.user), creator: result[0]});
                    }
                })
            }
        })
        
        app.get('/notifications', function(req, res){
            res.render('notifications');
        })
        
        app.get('/cart', function(req, res){
            
            var cart = req.session.cart;
            
            db.collection('testProducts').find({'_id': req.session.cart}).toArray(function(err, result){
                if (err) {
                    console.log(err);
                }else{
                    console.log(cart);
                    
                    console.log(result);
                    
                    res.render('cart', {cart: getCartContent.countCart(req.session.cart), signedIn: checkSignin(req.session.user), products: result});
                }
            })
        })
        
        app.get('/delete', function(req, res){
            collie.find({}).toArray(function(err, result){
                if (err){
                    console.log(err);
                }
                
                console.log('Showing Numbers');
                
                var userNums = result;
            })
            
            res.render('delete', {numbers: userNums});
        })
        
        //TEST: Used for deleting a number, DELETE route must be declared inside a PUT callback
        app.delete('/delete', function(req, res){
            
            var query = {number: req.body.deleteNum};
            
            collie.deleteOne(query, function(err, obj){
                err ? console.log(err) : console.log('You deleted ' + obj);
                
                res.redirect('delete');
            });
        })
        
        var product;
        
        app.get('/product/:id', function(req, res){
            db.collection('testProducts').find(ObjectId(req.params.id)).toArray(function (err, result){
                if (err) {
                    console.log(err);
                }else{
                    console.log(result[0]);
                    
                    product = result[0];
                    
                    res.render('product', {product: result[0]});
                }
            })
        })
        
        app.post('/product/:id', function(req, res){
            if (req.session.cart) {
                req.session.cart.push(req.body.productId);
            }else{
                req.session.cart = [req.body.productId];
            }
            
            console.log(req.session.cart);
            
            res.render('product', {product: product});
        })
        
        app.get('/productList', function(req, res){
            db.collection('testProducts').find({}).toArray(function(err, result){
                if (err) {
                    console.log(err);
                }
                
                products = result;
                
                res.render('productList', {products: products});
            })
        })
        
        app.get('/addProduct', function(req, res){
            res.render('addProduct');
        })
        
        app.post('/addProduct', function(req, res){
            var query = {name: req.body.name, price: req.body.price};
            
            db.collection('testProducts').insertOne(query, function(err, result){
                if (err) {
                    console.log(err);
                }
                
                res.render('productList');
            })
        })
        
        app.get('/image-upload', function(req, res){
            res.render('image-upload', {status: '',});
        })
        
        //app.post('/image-upload', upload.single('userImage'), function(req, res, next){
        //    console.log(req.file.originalname);
        //    
        //    respond = {
        //        message:'File Upload Successful',
        //        filename:req.file.originalname,
        //        type:req.file.mimetype
        //    };
        //    
        //    res.send({status: 'Good Upload'});
        //});
    }
})