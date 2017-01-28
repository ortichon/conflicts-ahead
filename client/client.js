'use strict';

var io = require('socket.io-client');
var toQueryString = require('querystring');
var _ = require('lodash');


function Client(username, ip , repoName) {
  this.username = username;
  this.ip = ip;
  this.touchedFiles = [];
  this.currentBranch = '';
  this.ioClient = null;
  this.repoName = repoName;
  console.log('Client initiated');
}

Client.prototype = {
  constructor: Client,

  connectToSocketIoServer: function() {
    var self = this;
    var query = toQueryString.stringify({
      repoName: this.repoName,
      username: this.username,
      ip: this.ip
    });

    this.ioClient = io.connect('http://localhost:9659', {query: query});
    // this.ioClient = io
    //   .connect('https://conflicts-ahead.herokuapp.com/', {query: query});

    this.ioClient.on('connect', function () {
      console.log('Socket is connected.');
      self.sendTouchedFilesToServer();
    });

    this.ioClient.on('disconnect', function () {
      console.log('Socket is disconnected.');
    });
  },

  sendTouchedFilesToServer: function() {
    this.ioClient.emit('files changed', this.touchedFiles);
  },

  updateTouchedFiles: function(fileList) {
    fileList = _.compact(fileList.split('\n'));
    var diff = !_.isEqual(fileList, this.touchedFiles);

    if (fileList && diff) {
      this.touchedFiles = fileList;
      this.sendTouchedFilesToServer();
    }
  },

  updateCurrentBranch: function(branchName) {
    if (!_.isEqual(branchName, this.currentBranch)) {
      this.currentBranch = branchName;
      this.ioClient.emit('branch changed', this.currentBranch);
    }
  }
};

module.exports = Client;
