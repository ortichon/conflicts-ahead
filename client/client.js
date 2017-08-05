'use strict';

import io from 'socket.io-client';
import toQueryString from 'querystring';
import _  from 'lodash';


export default class Client {

  constructor(username, ip , repoName) {
    this.username = username;
    this.ip = ip;
    this.touchedFiles = [];
    this.currentBranch = '';
    this.ioClient = null;
    this.repoName = repoName;
    console.log('Client initiated');
  }

  connectToSocketIoServer() {
    const query = toQueryString.stringify({
      repoName: this.repoName,
      username: this.username,
      ip: this.ip
    });

    this.ioClient = io.connect('http://localhost:9659', {query: query});
    // this.ioClient = io
    //   .connect('https://conflicts-ahead.herokuapp.com/', {query: query});

    this.ioClient.on('connect', () => {
      console.log('Socket is connected.');
      this.sendTouchedFilesToServer();
    });

    this.ioClient.on('disconnect', () => {
      console.log('Socket is disconnected.');
    });
  }

  sendTouchedFilesToServer() {
    this.ioClient.emit('files changed', this.touchedFiles, this.currentBranch);
  }

  updateTouchedFiles(fileList) {
    fileList = _.compact(fileList.split('\n'));
    const diff = !_.isEqual(fileList, this.touchedFiles);

    if (fileList && diff) {
      this.touchedFiles = fileList;
      this.sendTouchedFilesToServer();
    }
  }

  updateCurrentBranch(branchName) {
    if (!_.isEqual(branchName, this.currentBranch)) {
      this.currentBranch = branchName;
      this.ioClient.emit('branch changed', this.currentBranch);
    }
  }
};
