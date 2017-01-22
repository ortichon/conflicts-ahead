"use strict";

function User(username, ip) {
  this.username = username;
  this.ip = ip;
  this.isActive = true;
  this.touchedFiles = [];
  this.lastModified = null;
}

User.prototype = {
  constructor: User,

  activate: function() {
    this.isActive = true;
  },

  deactivate: function() {
    this.isActive = false;
  },

  updateTouchedFiles: function(fileList) {
    this.touchedFiles = fileList;
    this.lastModified = new Date();
    console.log('file list has updated for ', this.username);
  }
};

module.exports = User;
