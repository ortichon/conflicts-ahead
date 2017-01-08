var io = require('socket.io-client'),
    _ = require('lodash'),
    toQueryString = require('querystring');


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
    var query = toQueryString.stringify({username: this.username, ip: this.ip});

    this.ioClient = io.connect('http://localhost:9659', {query: query});
  },

  updateTouchedFiles: function(fileList) {
    fileList = _.compact(fileList.split('\n'));
    var diff = !_.isEqual(fileList, this.touchedFiles);
    var self = this;

    if (fileList && diff) {
      this.touchedFiles = fileList;
      console.log('touched files has updated for user: ', this.username);
      console.log('touched files: ', this.touchedFiles);
      var updateObject = {
        username: this.username,
        touchedFiles: this.touchedFiles
      };
      self.ioClient.emit('files changed', updateObject);
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
