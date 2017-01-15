function User(username, ip) {
  this.username = username;
  this.ip = ip;
  this.isActive = true;
  this.touchedFiles = [];
  this.lastModified = null;
}

User.prototype = {
  constructor: User,

  updateTouchedFiles: function(fileList) {
    // this.touchedFiles = _.union(this.touchedFiles, fileList);
    this.touchedFiles = fileList;
    this.lastModified = new Date();
    console.log('file list has updated for ', this.username);
  },

  activate: function() {
    this.isActive = true;
  },

  deactivate: function() {
    this.isActive = false;
  }
};

module.exports = User;
