var express = require('express');  
var bodyParser = require('body-parser'); 
var ejs = require('ejs');
var MongoClient = require('mongodb').MongoClient;
var app = express();  
var urlencodedParser = bodyParser.urlencoded({ extended: false });
MongoClient.connect("mongodb://127.0.0.1/bookMyShow",function(err,db){

	if(!err){

		db.authenticate("nikhil","nikhil",function(error,auth){
			console.log("Connected!\n");
			app.use(express.static('public')); 
			app.use(bodyParser.json());
			/*-----------------------ROOT DIR----------------------*/
			app.get('/', function (req, res) {  
		   		console.log("Got a GET request for the homepage");  
		   		res.send('<h1>Book tickets here</h1>');  
			});
			/*---------------------------ROOT END---------------------*/



			/*-------------SHOW PAGE-----------------------------------*/
			app.get('/show.html', function (req, res) {
	    		res.sendFile( __dirname + "/" + "show.html" );
			});
			app.get('/show_movies', function (req, res) { 
				var movie = req.query['movie_name'];
				console.log(req.query);
				//movie = movie.toString();
				//movie = "'"+movie+"'";
				console.log(movie);
				var mov_id = 0;
				if(movie == "bahubali"){
					mov_id = 1;
				}
				else if(movie == "transformers"){
					mov_id = 2;
				}
				else if(movie == "IT"){
					mov_id = 3;
				}
				//var query = movie_id:mov_id;
			 	db.collection('movies').find({movie_id:mov_id}).toArray(function(err, i) {
				    if (err) {
				    	console.log(err.message);
				    	console.log("Failed to get data.");
				    } else 
					{
						//console.log("Enter");
						console.log(i);
						if(i.length == 0){
							res.end("No theatres available!");
						}
						else{
							//res.status(200).json(docs);
							res.end(JSON.stringify(i));
							//res.render('disp.ejs',{movies: i}); 
						}
				    }
	  			});
	  		});

		/*------------------------SHOW END--------------------------*/

		/*-------------------------CANCEL--------------------*/

			app.get('/cancel.html', function (req, res) {
	    		res.sendFile( __dirname + "/" + "cancel.html" );
			});		

			app.get('/cancel_ticket',function(req,res){
				var book_id = parseInt(req.query['cancel_seat']);
				console.log(req.query);
				console.log("Cancelling ticket: "+book_id);
				db.collection('booking').remove({id:book_id});
				//console.log(db.collection('booking').find({}));
				res.end("Booking cancelled!");
			});

		/*-----------------------CANCEL END--------------------------------*/	

		/*-----------------------Boook tickets---------------------------------*/
			app.get('/book.html',function(req,res){
				res.sendFile(__dirname + "/" + "book.html");
			});

			app.get('/book_ticket',function(req,res){
				var movie = req.query['movie_name'];
				var seats = req.query['seats'];
				console.log(req.query);
				var theatre_name = req.query['theatre_name'];
				var book_id = Math.floor(Math.random()*1000);
				db.collection('booking').insert({movie_name:movie,no_of_seats: seats,theatre: theatre_name,id:book_id});
				var response = "Booking id: " + book_id;
				res.end(response);
			});




		/*--------------------------BOOK END------------------------------------*/

		/*--------------------------Update ticket--------------------------------*/

		app.get('/update_ticket.html',function(req,res){
			res.sendFile(__dirname + '/update_ticket.html');
		});

		app.get('/update_ticket',function(req,res){
			var book = parseInt(req.query['book_id']);
			var seats = parseInt(req.query['seats']);
			db.collection('booking').find({id:book}).toArray(function(err,docs){
				if(!err){
					console.log(docs);
					if(docs.length != 0){
						db.collection('booking').update({id:book},{$set:{no_of_seats:seats}});
						res.end(seats + " booked successfully");
					}
					else{
						res.end("Invalid booking ID!");
					}
				}
				else{
					res.end("Error!!");
				}
			});
		});



		/*--------------------------UPDATE END---------------------------------------*/

	  		var server = app.listen(5000, function () {  
				var host = server.address().address  
				var port = server.address().port  
				console.log("listening at http://%s:%s", host, port)  
			}) 
			
		
		/*---------------AUTH END---------------------------*/	
		});	
		
	}
	else{
		db.close();
	}
	
	
/*--------------CONNECT END-------------------------------------*/	
});