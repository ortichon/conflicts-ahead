var GitWatcher = require('./watcher'),
    Client = require('./client'),
    Git = require('simple-git'),
    Promise = require('bluebird'),
    IP = require('ip');


function Agent() {
  console.log('Agent initiated');
}

Agent.prototype = {
  constructor: Agent,

  initAgent: function(username, repoName) {
    var ipAddress = IP.address();
    var aClient = new Client(username, ipAddress, repoName);
    var aWatcher = new GitWatcher(aClient, 5000);

    aClient.connectToSocketIoServer();
    aWatcher.start();
  },

  start: function() {
    Promise.join(this.getGitUserName(), this.getRepoName(), this.initAgent);
  },

  getGitUserName: function() {
    return new Promise(function(resolve, reject) {
      Git().raw(['config' , 'user.name'], function(err, res) {
        if (err) {
          reject(err);
        } else {
          resolve(res.trim());
        }
      })
    })
  },

  getRepoName: function() {
    return new Promise(function(resolve, reject) {
      Git().getRemotes(true, function (err, res) {
        if (err) {
          reject(err);
        } else {
          var repoURL = res[0].refs.fetch;
          var repoName = repoURL.split('/').pop();
          resolve(repoName);
        }
      });
    })
  }
};

module.exports = Agent;