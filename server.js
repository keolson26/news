// Dependencies
var express = require("express");
var bodyParser = require("body-parser");
var logger = require("morgan");
var mongoose = require("mongoose");
// Requiring our Note and Article models
var Comment = require("./models/comments.js");
var News = require("./models/news.js");
var request = require("request");
var cheerio = require("cheerio");

mongoose.Promise = Promise;


var app = express();

app.use(logger("dev"));
app.use(bodyParser.urlencoded({
  extended: false
}));

app.use(express.static("public"));

mongoose.connect("mongodb://heroku_hgm6bx5f:3kalt71n2le60vsf2ms0iq1n58@ds143132.mlab.com:43132/heroku_hgm6bx5f");
var db = mongoose.connection;


db.on("error", function(error) {
  console.log("Mongoose Error: ", error);
});

// Once logged in to the db through mongoose, log a success message
db.once("open", function() {
  console.log("Mongoose connection successful.");
});

//Routes
app.get("/", function(req, res) {
  res.send(index.html);
});

//Scrape Site

app.get("/scrape", function(req, res) {

  request("http://www.echoJS.com/", function(error, response, html) {

   var $ = cheerio.load(html);
   $("article h2").each(function(i, element) {

      var result = {};

      result.title = $(this).children("a").text();
      result.link = $(this).children("a").attr("href");

      var entry = new News(result);

      entry.save(function(error, doc) {
        if (error) {
          console.log(error);
        }
        else {
          console.log(doc);
        }
      });
    });
  });
});

app.get("/news", function(req, res){
	News.find({}, function(error, doc) {
		if(error) {
			console.log(error);
		}
		else {
			res.send(doc);
		}
	});
});

//Get specific article
app.get("/news/:id", function(req,res) {
	News.findOne({"_id": req.params.id})
	.populate("comment")
	.exec(function(error, doc) {
		if(error) {
			res.send(error);
		}
		else {
			res.json(doc);
		}
	});
});

// //Manipulate Comments - New/Edit
app.post("/news/:id", function(req, res) {
	var addComment = new Comment(req.body);

	addComment.save(function (error, doc) {
		if (error) {
			res.send(error);
		}
		else {
			News.findOneAndUpdate({"_id": req.params.id}, {"comment": doc._id})
			.exec(function(error, doc) {
				if(error) {
					res.send(error);
				}
				else {
					res.send(doc);
				}

			});
		}
	});
});

app.listen(3000, function() {
  console.log("App running on port 3000!");
});