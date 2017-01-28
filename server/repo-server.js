'use strict';

var _ = require('lodash');


function RepoServer(repoName, users) {
  this.repoName = repoName;
  this.users = users;
  console.log('Created new team: ', this.repoName);
}

RepoServer.prototype = {
  constructor: RepoServer,

  addClient: function(client) {
    this.users[client.username] = client;
    console.log(client.username, ' with ip: ', client.ip, ' connected');
  },

  getUserCount: function() {
    return Object.keys(this.users).length;
  },

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
};

module.exports = RepoServer;
