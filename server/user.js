'use strict';

export default class User {
  constructor(username, ip) {
    this.username = username;
    this.ip = ip;
    this.isActive = true;
    this.touchedFiles = [];
    this.lastModified = null;
  }

  activate() {
    this.isActive = true;
  }

  deactivate() {
    this.isActive = false;
  }

  updateTouchedFiles(fileList) {
    this.touchedFiles = fileList;
    this.lastModified = new Date();
    console.log('file list has updated for ', this.username);
  }
};
