// 3rd party modules
var express = require('express'),
    io = require('socket.io'),
    _ = require('lodash');

// own modules
var RepoServer = require('./repo-server'),
    User = require('./user');


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

var availableRepos = {};

// Initial client connection sequence
ioServer.on('connection', function(socket) {
  var repoName = socket.handshake.query.repoName;
  var username = socket.handshake.query.username;
  var ip = socket.handshake.query.ip;
  var id = socket.id;

  var repoExists = _.has(availableRepos, repoName);

  if (repoExists) {
    var userExists = availableRepos[repoName]['users'][username];

    if (userExists) {
      userExists.activate();
    } else {
      // create new user
      var aClient = new User(username, ip);
      availableRepos[repoName].addClient(aClient);
    }
  } else {
    // create new user for the new repo
    var users = {};
    users[username] = new User(username, ip);

    // create new repo with the new user
    availableRepos[repoName] = new RepoServer(repoName, users);
  }


  socket.on('disconnect', function(){
    availableRepos[repoName]['users'][username].deactivate();
    console.log('client disconnected: ', username);
  });

  socket.on('files changed', function(touchedFiles) {
    availableRepos[repoName].updateTouchedFiles(username, touchedFiles);
  });

  socket.on('branch changed', function(currentBranch) {
    // aTeamServer.updateCurrentBranch(socket.id, currentBranch)
  })
});
