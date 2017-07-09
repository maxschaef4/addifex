#!/usr/bin/env node

var express = require('express');
var app = express();
var bodyParser = require('body-parser');
var urlEncodedParser = bodyParser.urlencoded({ extended: false });

//File Upload Variables
var fs = require('fs');
var multer = require('multer');
var storage = multer.diskStorage({
    destination: function(req, file, cb){
        cb(null, 'public/uploads/');
    },
    filename: function(req, file, cb){
        cb(null, file.originalname);
    }
})

var upload = multer({ storage: storage });

const port = 8081;

//Gets all the images needed for the site
app.use(express.static('pages'));
app.use(express.static('public'));
app.use(express.static('styles'));
app.use(express.static('images'));
app.use(bodyParser.urlencoded({ extended: false }));

//For using GET on form data
//app.get('/process_get', function (req, res) {
//    response = {
//        first_name:req.query.first_name,
//        last_name:req.query.last_name
//    };
//    
//    console.log(response);
//    res.end(JSON.stringify(response));
//})

app.post('/process_post', urlEncodedParser, function (req, res) {
    // Prepare output in JSON format
    response = {
        first_name:req.body.first_name,
        last_name:req.body.last_name
    };
    
    console.log(response);
    res.end(JSON.stringify(response));
})

app.get('/file_upload.html', function(req, res){
    console.log('Request for --upload_file-- received');
    res.sendFile('/file_upload.html');
})

app.get('/showImage.html', function(req, res){
    console.log('Request for --showImage-- received');
    res.sendFile(__dirname + '/showImage.html');
})

app.post('/file_upload', upload.single('file'), function(req, res, next){
    console.log(req.file.originalname);
    console.log(req.file.encoding);
    console.log(req.file.path);
    console.log(req.file.mimetype);
    
    respond = {
        message:'File Upload Successful',
        filename:req.file.originalname,
        type:req.file.mimetype
    };
    
    fs.readFile(req.file.path, (err, data) => {
        if (err){
            console.log(err);
        }else{
            res.end(data);
        }
    })
})

//app.post('/file_upload', function(req, res){
//    console.log(req.files);
//    console.log(req.files.file.path);
//    console.log(req.files.file.type);
//    var file = __dirname + "/" + req.files.file.name;
//    
//    fs.readFile(req.files.file.path, function(err, data){
//        fs.writeFile(file, data, function(err){
//            if(err){
//                console.log(err);
//            }else{
//                respond = {
//                    message:'File Upload Successful',
//                    filename:req.files.file.name
//                };
//                
//                console.log(respond);
//                res.end(JSON.stringify(respond));
//            }
//        })
//    })
//})

// This responds a GET request for abcd, abxcd, ab123cd, and so on
//app.get('/ab*cd', function(req, res) {   
//   console.log("Got a GET request for /ab*cd");
//   res.send('Page Pattern Match');
//})

var server = app.listen(port, function(){
    var host = server.address().address;
    //var port = server.address().port;
    
    console.log("Server started at " + host + port);
})