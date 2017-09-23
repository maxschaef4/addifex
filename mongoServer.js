//Connecting to MongoDB cluster1
const mongoClient = require('mongodb').MongoClient;
//Gives me access to the auto-generated id for being able to find users by id
const ObjectId = require('mongodb').ObjectID;

const assert = require('assert');
//Used for MongoDB Atlas--Add later
//var uri = "mongodb://maxwell-schaefer:Cluster1Passwrd@cluster1-shard-00-00-gagz1.mongodb.net:27017,cluster1-shard-00-01-gagz1.mongodb.net:27017,cluster1-shard-00-02-gagz1.mongodb.net:27017/Addifex?ssl=true&replicaSet=Cluster1-shard-0&authSource=admin";

//Getting and starting express
const express = require('express');
const app = express();
const port = 8081;

//Used for overriding HTTP verbs...specifically for delete and put methods
const methodOverride = require('method-override');

// override with different headers; last one takes precedence
app.use(methodOverride('_method'));          // Microsoft

//Handlebars support
const handlebars = require('express-handlebars').create({
    //Defines the name the default layout file
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
});
app.engine('handlebars', handlebars.engine);
app.set('view engine', 'handlebars');

//Using body-parser middleware
app.use(require('body-parser').urlencoded({extended: true}));

//Imports and code required for cookie/session use
//Client Sessions automatically encypts the cookies
const session = require('client-sessions');
//Used for using different kinds of cookies
app.use(
    session({
        cookieName: 'session',
        secret: 'I guess a random string goes here',
        duration: 24 * 60 * 60 * 1000,
        activeDuration: 60 * 60 * 1000,
    })
);

app.use(
    session({
        cookieName: 'cart',
        secret: 'Not sure yet',
        duration: 24 * 60 * 60 * 1000,
        activeDuration: 60 * 60 * 1000,
    })
)

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

//used for parsing and getting dynamically generated pages
const url = require('url');

//Custom modules
const scooby = require('./lib/scooby.js');
const getCartContent = require('./lib/cartContent.js');

//Gets static files
app.use(express.static(__dirname + '/public'));

//--------Partials Go Below Here-------

function notSignedin() {
    return 'Please Sign In!';
}

mongoClient.connect(url, function(err, db){
    assert.equal(null, err);
    console.log('Successful connection to Mongo Server');
    
    app.listen(port);
    console.log('Listening on port: ' + port);
    
    var collie = db.collection('testCollection');
    
    var userNums, creators, products;
    
    //Renders the index page
    //Gets all the numbers in the testCollection collection
    //Gets all the creators in the testCreator collection
    app.get('/', function(req, res){
        collie.find({}).toArray(function(err, result){
            if (err){
                console.log(err);
            }
            
            console.log('Showing Numbers');
            
            userNums = result;
        });
        
        db.collection('testCreator').find({}).toArray(function(err, result){
            if (err) {
                console.log(err);
            }
            
            console.log('showing users');
            
            creators = result;
        });
        
        res.render('index', {scooby : scooby.getScooby(), cart: getCartContent.countCart(req.session.cart), numbers: userNums, users: creators,});
    });
    
    //TEST: used for adding a number to a test collection then outputting all of them
    app.post('/', function(req, res){
        var query = {number: req.body.number};
        
        collie.insertOne(query, function(err, result) {
            if (err){
                console.log(err);
            }
            
            res.redirect('/');
        })
    });
    
    app.get('/delete', function(req, res){
        collie.find({}).toArray(function(err, result){
            if (err){
                console.log(err);
            }
            
            console.log('Showing Numbers');
            
            userNums = result;
        });
        
        res.render('delete', {numbers: userNums});
    });
    
    //TEST: Used for deleting a number, DELETE route must be declared inside a PUT callback
    app.delete('/delete', function(req, res){
        
        var query = {number: req.body.deleteNum};
        
        collie.deleteOne(query, function(err, obj){
            err ? console.log(err) : console.log('You deleted ' + obj);
            
            res.redirect('delete');
        });
    });
    
    app.get('/signup', function(req, res){
        res.render('signup');
    })
    
    //Used for signing up a new creator
    app.post('/signup', function(req, res){
        var newInfo = {name: req.body.name, email: req.body.newEmail, password: req.body.newPassword};
        
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
    });
    
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
        });
    });
    
    app.get('/account', function(req, res){
        var message = '';
        
        if (!req.session.user) {
            message = 'Please sign in!';
            res.render('account', {status: message});
        }else{
            db.collection('testCreator').findOne(ObjectId(req.session.user), function(err, result){
                if (err) {
                    console.log(err);
                }else{
                    message = 'Welcome ' + result.name + '!';
                    
                    res.render('account', {status: message, creator: result});
                }
            });
        }
    })
    
    app.get('/product', function(req, res){
        var h = url.hash;
        //removes the leading hash from url.hash
        var productId = h.slice(1, h.length);
        
        db.collection('testProducts').findOne(productId, function(err, result){
            
        });
        
        res.render('product');
    });
    
    app.post('/product', function(req, res){
        if (req.session.cart) {
            req.session.cart.push(req.body.product);
        }else{
            var content = [req.body.product];
            
            req.session.cart = content;
        }
        
        res.render('product');
    })
    
    app.get('/productList', function(req, res){
        db.collection('testProducts').find({}).toArray(function(err, result){
            if (err) {
                console.log(err);
            }
            
            products = result;
        });
        
        res.render('productList', {products: products});
    })
    
    app.get('/addProduct', function(req, res){
        res.render('addProduct');
    });
    
    app.post('/addProduct', function(req, res){
        var query = {name: req.body.name, price: req.body.price};
        
        db.collection('testProducts').insertOne(query, function(err, result){
            if (err) {
                console.log(err);
            }
            
            res.redirect('productList');
        })
    })
    
    app.get('/cart', function(req, res){
        res.render('cart', {cart: getCartContent.countCart(req.session.cart),});
    })
    
    app.get('/image-upload', function(req, res){
        res.render('image-upload', {status: '',});
    });
    
    app.post('/image-upload', upload.single('userImage'), function(req, res, next){
        console.log(req.file.originalname);
        
        respond = {
            message:'File Upload Successful',
            filename:req.file.originalname,
            type:req.file.mimetype
        };
        
        res.send({status: 'Good Upload'});
    });
});