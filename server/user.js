'use strict';

export default class User {
  constructor(username, ip) {
    this.username = username;
    this.ip = ip;
    this.isActive = true;
    this.touchedFiles = {};
  }

  activate() {
    this.isActive = true;
  }

  deactivate() {
    this.isActive = false;
  }

  updateTouchedFiles(fileList, currentBranch) {
    this.touchedFiles[currentBranch] = {
      files: fileList,
      lastModified: new Date()
    };
    console.log('file list has updated for ', this.username);
  }
};
