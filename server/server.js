var express = require('express'),
    io = require('socket.io');


var app = express();  // Define our app using express


app.get('/', function(req, res){
  res.sendFile(__dirname + '/index.html');
});


// Initialize web server
var server = app.listen(9659, function() {
  console.log('listening on port 9659');
});

// Initialize socket.io server
var ioServer = io.listen(server);


ioServer.on('connection', function(socket) {
  console.log('a user connected with id: ', socket.id);
  console.log('username: ', socket.handshake.query.username);
  console.log('ip: ', socket.handshake.query.ip);

  socket.on('disconnect', function(){
    console.log('user disconnected with id: ', socket.id);
  });

  socket.on('foo', function(msg) {
    console.log('>>> ', msg);
  })
});
