var express = require('express'),
    io = require('socket.io'),
    _ = require('lodash');

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
    repoName: socket.handshake.query.repoName,
    username: socket.handshake.query.username,
    ip: socket.handshake.query.ip,
    id: socket.id
  };

  console.log('userObject: ', userObject);

  aTeamServer.addClient(userObject);

  socket.on('disconnect', function(){
    console.log('client disconnected');
    aTeamServer.removeClient(userObject);
  });

  socket.on('files changed', function(touchedFiles) {
    aTeamServer.updateTouchedFiles(socket.id, touchedFiles);
  });

  socket.on('branch changed', function(currentBranch) {
    aTeamServer.updateCurrentBranch(socket.id, currentBranch)
  })
});

// TODO: maybe change to connected clients
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
    console.log('>>> : ', this.users[clientId]);
  },

  updateCurrentBranch: function(clientId, currentBranch) {
    this.users[clientId].currentBranch = currentBranch;
    console.log('current branch for ', this.users[clientId].username, ' updated');
    console.log('>>> : ', this.users[clientId]);
  }
};

// TODO: maybe change to users db?
function UserData(username, branchName) {
  this.username = username;
  this[username] = {};
  this[username][branchName] = {
    file_list: [],
    last_modified: new Date(),
    isActive: true
  }
}

UserData.prototype = {
  constructor: UserData,

  updateTouchedFiles: function(branchName, fileList) {
    this[branchName].file_list = _.union(this[branchName].file_list, fileList);
    console.log('file list has updated for branch ', branchName, ' [', this.username, ']');
  }
};



var aTeamServer = new TeamServer('Test team',{});

