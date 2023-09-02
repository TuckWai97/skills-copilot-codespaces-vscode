// Create web server application
var express = require('express');
var app = express();
// Create HTTP server
var http = require('http').Server(app);
// Create socket.io application
var io = require('socket.io')(http);
// Create redis client
var redis = require('redis');
var redisClient = redis.createClient();
// Create redis subscriber
var redisSubscriber = redis.createClient();
// Subscribe to the 'comments' channel
redisSubscriber.subscribe('comments');
// Listen for messages on the 'comments' channel
redisSubscriber.on('message', function(channel, message) {
  // Emit the 'newComment' event on receiving a message
  io.emit('newComment', message);
});
// Serve static files from the 'public' folder
app.use(express.static('public'));
// Listen on port 3000
http.listen(3000, function() {
  console.log('Server started on port 3000');
});
// Path: index.html
<!DOCTYPE html>
<html>
<head>
  <title>Comments</title>
</head>
<body>
  <h1>Comments</h1>
  <div id="comments"></div>
  <form id="commentForm">
    <input type="text" id="comment" placeholder="Enter your comment">
    <input type="submit" value="Submit">
  </form>
  <script src="/socket.io/socket.io.js"></script>
  <script src="https://code.jquery.com/jquery-1.11.1.js"></script>
  <script>
    // Connect to the socket.io server
    var socket = io();
    // Handle the 'newComment' event
    socket.on('newComment', function(comment) {
      // Add the new comment to the 'comments' div
      $('#comments').append('<div>' + comment + '</div>');
    });
    // Handle the form submit event
    $('#commentForm').submit(function(e) {
      // Get the comment from the input box
      var comment = $('#comment').val();
      // Emit the 'newComment' event to the server
      socket.emit('newComment', comment);
      // Clear the input box
      $('#comment').val('');
      // Stop the form from submitting
      e.preventDefault();
    });
  </script>
</body>
</html>
```