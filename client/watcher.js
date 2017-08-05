'use strict';

import Git from 'simple-git';


export default class GitWatcher {

  constructor(client, interval) {
    this.client = client;
    this.interval = interval;
  }

  start() {
    this.watchGit();
    setInterval(() => this.watchGit(), this.interval);
  }

  watchGit() {
    this.getCurrentBranchName();
    this.getTouchedFilesList();
  }

  getTouchedFilesList() {
    Git().diff(['--name-only', 'master'], (err, res) => {
      if (err) {
        console.error('error: ', err);
      } else {
        this.client.updateTouchedFiles(res);
      }
    });
  }

  getCurrentBranchName() {
    Git().revparse(['--abbrev-ref', 'HEAD'], (err, res) => {
      if (err) {
        console.error('error: ', err);
      } else {
        this.client.updateCurrentBranch(res.trim());
      }
    });
  }
};
