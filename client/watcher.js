var git = require('simple-git');


function GitWatcher(client, interval) {
  this.client = client;
  this.interval = interval;
}

GitWatcher.prototype = {
  constructor: GitWatcher,
  start: function() {
    var self = this;
    this.watchGit();
    setInterval(function() {self.watchGit()}, self.interval);
  },
  watchGit: function() {
    this.getCurrentBranchName();
    this.getTouchedFilesList();
  },
  getTouchedFilesList: function() {
    var self = this;
    git().diff(['--name-only'], function(err, res) {
      if (err) {
        console.error('error: ', err);
      } else {
        self.client.updateTouchedFiles(res);
      }
    });
  },
  getCurrentBranchName: function () {
    var self = this;
    git().revparse(['--abbrev-ref', 'HEAD'], function(err, res) {
      if (err) {
        console.error('error: ', err);
      } else {
        self.client.updateCurrentBranch(res);
      }
    })
  }
};

module.exports = GitWatcher;
