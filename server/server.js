var express = require('express');
var http = require('http');
var io = require('socket.io');

var app = express();
var server = http.Server(app);
var ioServer = io(server);

server.listen(9659, function() {
  console.log('listening on *:9659');
});


app.get('/', function(req, res){
  res.sendFile(__dirname + '/index.html');
});


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
