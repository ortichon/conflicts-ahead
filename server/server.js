var express = require('express'),
    io = require('socket.io'),
    Client = require('../client/client');


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
  var userObject = {
    username: socket.handshake.query.username,
    ip: socket.handshake.query.ip,
    id: socket.id
  };

  aTeamServer.addClient(userObject);

  socket.on('disconnect', function(){
    aTeamServer.removeClient(userObject);
  });

  socket.on('files changed', function(msg) {
    aTeamServer.updateTouchedFiles(socket.id, msg.touchedFiles);
  })
});

function TeamServer(teamName, users) {
  this.teamName = teamName;
  this.users = users;
  this.userCount = function() {
    return Object.keys(this.users).length;
  };
  console.log('Created new team: ', this.teamName);
}

TeamServer.prototype = {
  constructor: TeamServer,

  addClient: function(client) {
    this.users[client.id] = client;
    console.log(client.username, ' with ip: ', client.ip, ' connected');
  },

  removeClient: function(client) {
    delete this.users[client.id];
    console.log('client ', client.username, ' removed');

  },

  updateTouchedFiles: function(clientId, touchedFiles) {
    this.users[clientId].touchedFiles = touchedFiles;
    console.log('touched files for ', this.users[clientId].username, ' updated');
  }
};

var aTeamServer = new TeamServer('Test team',{});

