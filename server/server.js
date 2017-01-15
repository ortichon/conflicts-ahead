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

// var aTeamServer = new RepoServer('Test team',{});

// TODO: maybe change to connected clients
function RepoServer(repoName, users) {
  this.repoName = repoName;
  this.users = users;
  console.log('Created new team: ', this.repoName);
}

RepoServer.prototype = {
  constructor: RepoServer,

  addClient: function(client) {
    // this.users[client.id] = client;
    this.users[client.username] = client;
    console.log(client.username, ' with ip: ', client.ip, ' connected');
    console.log('this.users: ', this.users);
  },

  getUserCount: function() {
    return Object.keys(this.users).length;
  },

  // removeClient: function(client) {
  //   delete this.users[client.id];
  //   console.log('client ', client.username, ' removed');
  //
  // },

  showActiveUsers: function() {
    // filter out deactivated users
    var activeUsers = _.filter(this.users, function(user) {
      return user.isActive;
    });
    // return only user names instead of whole object
    return _.map(activeUsers, function(user) {
      return user.username;
    });
  },

  updateTouchedFiles: function(username, touchedFiles) {
    this.users[username].updateTouchedFiles(touchedFiles);
    console.log('>>> : ', this.users[username]);
  }

  // updateCurrentBranch: function(clientId, currentBranch) {
  //   this.users[clientId].currentBranch = currentBranch;
  //   console.log('current branch for ', this.users[clientId].username, ' updated');
  //   console.log('>>> : ', this.users[clientId]);
  // }
};

// TODO: maybe change to users db?
function User(username, ip) {
  this.username = username;
  this.ip = ip;
  this.isActive = true;
  this.touchedFiles = [];
  this.lastModified = null;
}

User.prototype = {
  constructor: User,

  updateTouchedFiles: function(fileList) {
    // this.touchedFiles = _.union(this.touchedFiles, fileList);
    this.touchedFiles = fileList;
    this.lastModified = new Date();
    console.log('file list has updated for ', this.username);
  },

  activate: function() {
    this.isActive = true;
  },

  deactivate: function() {
    this.isActive = false;
  }
};





