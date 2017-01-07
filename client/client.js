var io = require('socket.io-client'),
    _ = require('lodash');


function Client(username, ip) {
  this.username = username;
  this.ip = ip;
  this.touchedFiles = [];
  this.currentBranch = '';
  this.ioClient = null;
  console.log('Client initiated');
}

Client.prototype = {
  constructor: Client,
  connectToSocketIoServer: function() {
    var self = this;
    var queryString = 'username=' + self.username + '&ip=' + self.ip;

    this.ioClient = io.connect('http://localhost:9659', {query: queryString});
  },
  updateTouchedFiles: function(fileList) {
    fileList = _.compact(fileList.split('\n'));
    var diff = !_.isEqual(fileList, this.touchedFiles);
    var self = this;

    if (fileList && diff) {
      this.touchedFiles = fileList;
      console.log('touched files has updated for user: ', this.username);
      console.log('touched files: ', this.touchedFiles);
      self.ioClient.emit('foo', 'user ' + this.username + ' changed files: ' + this.touchedFiles);
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
