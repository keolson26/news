var mongoose = require("mongoose");

var Schema = mongoose.Schema;

var CommentsSchema = new Schema({
	title: {
		type: String,
	},
	body: {
		type: String,
	}, 
});

var Comment = mongoose.model("Comment", CommentsSchema); 

module.exports = Comment;