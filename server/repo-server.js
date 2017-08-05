'use strict';

import _ from 'lodash';


export default class RepoServer {

  constructor(repoName, users) {
    this.repoName = repoName;
    this.users = users;
    console.log('Created new team: ', this.repoName);
  }

  addClient(client) {
    this.users[client.username] = client;
    console.log(client.username, ' with ip: ', client.ip, ' connected');
  }

  getUserCount() {
    return Object.keys(this.users).length;
  }

  showActiveUsers() {
    // filter out deactivated users
    const activeUsers = _.filter(this.users, (user) => user.isActive);
    // return only user names instead of whole object
    return _.map(activeUsers, (user) => user.username);
  }

  updateTouchedFiles(username, touchedFiles, currentBranch) {
    if (!_.isEmpty(touchedFiles) && !_.isEmpty(currentBranch)) {
      this.users[username].updateTouchedFiles(touchedFiles, currentBranch);
      console.log('>>> : ', this.users[username]);
    }
  }
};
