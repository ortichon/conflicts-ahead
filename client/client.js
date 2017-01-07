var _ = require('lodash');
var socket = require('socket.io-client')('http://localhost:9659');

function Client(username, ip) {
  this.username = username;
  this.ip = ip;
  this.touchedFiles = [];
  this.currentBranch = '';
  console.log('Client initiated');
}

Client.prototype = {
  constructor: Client,
  updateTouchedFiles: function(fileList) {
    fileList = _.compact(fileList.split('\n'));
    var diff = !_.isEqual(fileList, this.touchedFiles);

    if (fileList && diff) {
      this.touchedFiles = fileList;
      console.log('touched files has updated for user: ', this.username);
      console.log('touched files: ', this.touchedFiles);
      socket.emit('foo', 'user: ' + this.username + ' changed files: ' + this.touchedFiles);
    }
  },
  updateCurrentBranch: function(branchName) {
    branchName = _.trim(branchName);

    if (!_.isEqual(branchName, this.currentBranch)) {
      this.currentBranch = branchName;
      console.log('branch name has updated for user: ', this.username);
      console.log('branch name: ', this.currentBranch);
    }
  }
};

module.exports = Client;
