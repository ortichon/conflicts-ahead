'use strict';

// nodejs modules
var fs = require('fs');
// own modules
var RepoServer = require('./repo-server');
var User = require('./user');


var availableRepos = {};

var dataHandler = {
  fetchLocalData: function fetchLocalData(path) {
    path = path ? path : './localData.json';
    try {
      var content = fs.readFileSync(path); // read data file
      var json = JSON.parse(content);      // parse data file
      var repos = Object.keys(json);       // get repo names

      // create RepoServer class for each repo name
      repos.forEach(function(repoName) {
        var repo = new RepoServer(repoName, {});
        var users = Object.keys(json[repoName].users);  // get user names

        // create User class for each user
        users.forEach(function(username) {
          var currentUser = json[repoName].users[username];
          var user = new User(username, currentUser.ip);

          user.deactivate();
          user.touchedFiles = currentUser.touchedFiles;
          user.lastModified = currentUser.lastModified;
          repo.addClient(user);
        });

        availableRepos[repoName] = repo;   // update available repos object
      });

    } catch (err) {
      availableRepos = {};  // if file does not exists or not readable
    }
    return availableRepos;
  },

  storeLocalData: function storeLocalData(callback) {
    var json = JSON.stringify(availableRepos, null, 2);

    console.log('Writing JSON file to folder...');
    fs.writeFile('./localData.json', json, callback);
  }
};

module.exports = dataHandler;
