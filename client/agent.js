'use strict';

// 3rd party modules
import Git from 'simple-git';
import IP from 'ip';
// own modules
import Client from './client';
import GitWatcher from './watcher';


export default class Agent {

  constructor() {
    console.log('Agent initiated');
  }

  getGitUserName() {
    return new Promise((resolve, reject) => {
      Git().raw(['config' , 'user.name'], (err, res) => {
        if (err) {
          reject(err);
        } else {
          resolve(res.trim());
        }
      });
    });
  }

  getRepoName() {
    return new Promise((resolve, reject) => {
      Git().getRemotes(true,  (err, res) => {
        if (err) {
          reject(err);
        } else {
          const repoURL = res[0].refs.fetch;
          const repoName = repoURL.split('/').pop();
          resolve(repoName);
        }
      });
    });
  }

  static initAgent(username, repoName) {
    const ipAddress = IP.address();
    const aClient = new Client(username, ipAddress, repoName);
    const aWatcher = new GitWatcher(aClient, 5000);

    aClient.connectToSocketIoServer();
    aWatcher.start();
  }

  start() {
    Promise.all([this.getGitUserName(), this.getRepoName()])
      .then(values => {
        Agent.initAgent(values[0], values[1]);
      });
  }
};
