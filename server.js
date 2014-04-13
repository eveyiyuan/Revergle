/*var connect = require('connect');
connect.createServer(
    connect.static(__dirname)
).listen(8080)*/
/*var express = require('express');
var app = express();
app.configure(function () {
    app.use(
        "/", //the URL throught which you want to access to you static content
        express.static(__dirname) //where your static content is located in your filesystem
    );
});
app.listen(3000); //the port you want to use*/
var http = require('http'),
      fs = require('fs'),
     url = require('url');

/*var databaseUrl = "localhost:27017"; 
var collections = ["crawly"];
var db = require("mongojs").connect(databaseUrl, collections);*/
var MongoClient = require('mongodb').MongoClient;
var collection;
MongoClient.connect('mongodb://localhost/test_database', function(err, db) {
  if(err) throw err;
  console.log("Connected to Database");
  var collection = db.collection('crawly');
 /* collection.find().toArray(function(err, docs){
      console.log(docs);
  });*/


http.createServer(function(request, response){
    var path = url.parse(request.url).pathname;
    if(path == "/") {
    	fs.readFile('./index.html', function(err, file) {  
            if(err) {  
                // write an error response or nothing here  
                return;  
            }  
            response.writeHead(200, { 'Content-Type': 'text/html' });  
            response.end(file, "utf-8");  
        });
    }
    else if(path == "/jquery.min.js") {
    	fs.readFile('./jquery.min.js', function(err, file) {  
            if(err) {  
                // write an error response or nothing here  
                return;  
            }  
            response.writeHead(200, { 'Content-Type': 'text/javascript' });  
            response.end(file, "utf-8");  
        });
    }
    else if (path == "/logo.png") {
    	fs.readFile('./logo.png', function(err, file) {
    		if (err) {
    			return;
    		}
    	
            response.writeHead(200, {"Content-Type": "Image"});
            response.end(file);
        });
    }
    else if (path == "/style.css") {
    	fs.readFile('./style.css', function(err, file) {
    		if (err) {
    			return;
    		}
    	
            response.writeHead(200, {"Content-Type": "text/css"});
            response.end(file);
        });
    }
    else {
        console.log("request recieved");
        var string = path;
        string = path.substring(1, string.length);
        var toReturn = "";
        /*db.crawly.find({'title': string}), function(err, pages) {
        	if( err || !users) 
        		toReturn = "Outta luck bro. Nothin for you";
            else pages.forEach( function(page) {
                toReturn += page + "\n";
        } );
        }*/
        collection.find({"title": new RegExp(string)}).sort({"rank": 1}).toArray(function(err, docs){
        	console.log(string);
        	if (docs.length == 0){
        		toReturn = "Sorry bro. Nothin found";
        	}
        	else {
        		for(i=0; i<docs.length; i++){
        			toReturn += docs[i].title.toString()+"\n";
        		}
        		//toReturn = docs.toString();
        	}
        	response.writeHead(200, {"Content-Type": "text/plain"});
            response.end(toReturn);
            console.log("string sent");
        })
        
    }
}).listen(8001);
});