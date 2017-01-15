"use strict";
var _ = require('lodash');

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

module.exports = RepoServer;