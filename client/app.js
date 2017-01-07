"use strict";
var io = require('socket.io');
var socket = require('socket.io-client')('http://localhost:9659');

var git = require('simple-git');
var _ = require('lodash');


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


var aClient = new Client('Or Tichon', '127.0.0.1');
var aWatcher = new GitWatcher(aClient, 5000);

aWatcher.start();