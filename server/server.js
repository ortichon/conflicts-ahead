"use strict";

// nodejs modules
var path = require('path');
// 3rd party modules
var express = require('express');
var io = require('socket.io');
var _ = require('lodash');
// own modules
var RepoServer = require('./repo-server');
var User = require('./user');
var DataHandler = require('./data-handler');


// let the server die gracefully
process.on('SIGINT', cleanExit); // catch ctrl-c
process.on('SIGTERM', cleanExit); // catch kill
// process.on('uncaughtException',cleanExit);

function cleanExit() {
  DataHandler.storeLocalData(process.exit);
}

// get available repos from file
var availableRepos = DataHandler.fetchLocalData();

// Define our app using express
var app = express();

// Initialize web server
var server = app.listen(9659, function() {
  console.log('listening on port 9659');
});

// Initialize socket.io server
var ioServer = io.listen(server);

// define public folder - for front-end use
var publicFolder = __dirname + '/public';

app.use(express.static(publicFolder));

// basic initial client response
app.get('*', function(req, res) {
  res.sendFile(path.join(publicFolder + '/index.html'));
});


// Initial client connection sequence
ioServer.on('connection', function(socket) {
  var repoName = socket.handshake.query.repoName;
  var username = socket.handshake.query.username;
  var ip = socket.handshake.query.ip;

  var repoExists = _.has(availableRepos, repoName);

  if (repoExists) {
    console.log('repo exists');
    var userExists = availableRepos[repoName]['users'][username];

    if (userExists) {
      console.log('userExists');
      userExists.activate();
    } else {
      console.log('creating new user');
      var aClient = new User(username, ip);
      availableRepos[repoName].addClient(aClient);
    }
  } else {
    console.log('creating new repo');
    var users = {};
    console.log('creating new user');
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
