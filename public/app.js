$("#newsBtn").on("click", function(event) {
  event.preventDefault();

  $.get("/news", function(data) { 

  console.log("Here in ajax");
  for (var i = 0; i < data.length; i++) {
    var wellSection = $("<div>");
      wellSection.addClass("well");
      wellSection.attr("id", "news-well-" + i);
      $("#showNews").append(wellSection);

      $("#news-well-" + i).append("<h2>Title: " + data[i].title + "</h2>");
      $("#news-well-" + i).append("<h3>Link: " + data[i].link + "</h3>");
      $("#news-well-" + i).append("<h3>ID: " + data[i]._id + "</h3>");
      $("#news-well-" + i).append("<button class='add btn btn-success' id = 'addBtn' data-id='"+data[i]._id+"'>Add Comment</button>");
      $("#news-well-" + i).append("<button class='see btn btn-primary' id = 'dispBtn' data-id='"+data[i]._id+"'>See Comments</button>");
      $("#news-well-" + i).append("<div id = 'commentDiv-" +data[i]._id+"'></div>");
    }
  });
});


$(".see").on("click", function(event) {


console.log("see comment clicked");

$("#commentDiv").empty();

  var thisId = $(this).attr("data-id");
  var commentAppend = "#CommentDiv"+thisId;

  $.ajax({
    method: "GET",
    url: "/news/" + thisId
  }).done(function(data) {
    for (var i = 0; i < data.length; i++) {
    var commentSection = $("<div>");
      commentSection.addClass("well");
      commentSection.attr("id", "comment-well-" + i);
      $("#commentDiv").append(commentSection);

      $("#comment-well-" + i).append("<h2>Title: " + data[i].title + "</h2>");
      $("#comment-well-" + i).append("<p>Comment: " + data[i].body + "</hp>");
    }
  });
});


//add commment
$(".add").on("click", function(event) {

console.log("new comment clicked");

$("#commentDiv").empty();

  var thisId = $(this).attr("data-id");
  var commentAppend = "#CommentDiv"+thisId;

  $.ajax({
    method: "GET",
    url: "/news/" + thisId
  })
    .done(function(data) {
      console.log(data);
      // The title of the article
      $("commentAppend").append("<h2>" + data.title + "</h2>");
      // An input to enter a new title
      $("commentAppend").append("<input id='titleinput' name='title' >");
      // A textarea to add a new note body
      $("commentAppend").append("<textarea id='bodyinput' name='body'></textarea>");
      // A button to submit a new note, with the id of the article saved to it
      $("commentAppend").append("<button data-id='" + data._id + "' id='saveComment'>Save Comment</button>");

    });
});


$("#saveComment").on("click", function(event) {

  var thisId = $(this).attr("data-id");

  // Run a POST request to change the note, using what's entered in the inputs
  $.ajax({
    method: "POST",
    url: "/news/" + thisId,
    data: {
      // Value taken from title input
      title: $("#titleinput").val(),
      // Value taken from note textarea
      body: $("#bodyinput").val()
    }
  })
    // With that done
    .done(function(data) {
      // Log the response
      console.log(data);
      // Empty the notes section
      $("#comment").empty();
    });

  // Also, remove the values entered in the input and textarea for note entry
  $("#titleinput").val("");
  $("#bodyinput").val("");
});


 