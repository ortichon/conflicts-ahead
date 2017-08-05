'use strict';

// NodeJS modules
import fs from 'fs';
// own modules
import RepoServer from './repo-server';
import User from './user';

export default class DataHandler {

  constructor() {
    this.availableRepos = {};
  }

  fetchLocalData(path) {
    path = path ? path : './localData.json';
    try {
      const content = fs.readFileSync(path); // read data file
      const json = JSON.parse(content);      // parse data file
      const repos = Object.keys(json);       // get repo names

      // create RepoServer class for each repo name
      repos.forEach(repoName => {
        const repo = new RepoServer(repoName, {});
        const users = Object.keys(json[repoName].users);  // get user names

        // create User class for each user
        users.forEach(username => {
          const currentUser = json[repoName].users[username];
          const user = new User(username, currentUser.ip);

          user.deactivate();
          user.touchedFiles = currentUser.touchedFiles;
          repo.addClient(user);
        });

        this.availableRepos[repoName] = repo;   // update available repos object
      });

    } catch (err) {
      this.availableRepos = {};  // if file does not exists or not readable
    }
    return this.availableRepos;
  }

  storeLocalData(callback) {
    const json = JSON.stringify(this.availableRepos, null, 2);

    console.log('Writing JSON file to folder...');
    fs.writeFile('./localData.json', json, callback);
  }
};
