"use strict";
var GitWatcher = require('./watcher');
var Client = require('./client');
var Git = require('simple-git');
var Promise = require('bluebird');
var ip = require('ip');


function getRepoName() {
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

function getGitUserName() {
 return new Promise(function(resolve, reject) {
   Git().raw(['config' , 'user.name'], function(err, res) {
     if (err) {
       reject(err);
     } else {
       resolve(res.trim());
     }
   })
 })
}

Promise.join(getGitUserName(), getRepoName(), initUser);

function initUser(username, repoName) {
  var ipAddress = ip.address();
  var aClient = new Client(username, ipAddress, repoName);
  var aWatcher = new GitWatcher(aClient, 5000);

  aClient.connectToSocketIoServer();
  aWatcher.start();
}

// var bClient = new Client('Roni Sabas', '127.0.0.2');
// bClient.connectToSocketIoServer();