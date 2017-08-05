'use strict';

// NodeJS modules
import path from 'path';
// 3rd party modules
import express from 'express';
import io from 'socket.io';
import _ from 'lodash';
// own modules
import RepoServer from './repo-server';
import User from './user';
import DataHandler from './data-handler';


const port = process.env.PORT || 9659;

const dataHandler = new DataHandler();

// let the server die gracefully
process.on('SIGINT', cleanExit); // catch ctrl-c
process.on('SIGTERM', cleanExit); // catch kill
// process.on('uncaughtException',cleanExit);

function cleanExit() {
  dataHandler.storeLocalData(process.exit);
}

// get available repos from file
const availableRepos = dataHandler.fetchLocalData();

// Define our app using express
const app = express();

// Initialize web server
const server = app.listen(port, () => console.log('listening on port: ', port));

// Initialize socket.io server
const ioServer = io.listen(server);

// define public folder - for front-end use
const publicFolder = __dirname + '/public';

app.use(express.static(publicFolder));

// basic initial client response
app.get('/', (req, res) => {
  res.sendFile(path.join(publicFolder + '/index.html'));
});

app.get('/repos', (req, res) => {
  res.send({data: Object.keys(availableRepos)});
});

app.get('/users/:repoName', (req, res) => {
  const repoName = req.params.repoName;
  const userList = _.toArray(availableRepos[repoName].users);

  res.send({data: userList});
});


// Initial client connection sequence
ioServer.on('connection', socket => {
  const repoName = socket.handshake.query.repoName;
  const username = socket.handshake.query.username;
  const ip = socket.handshake.query.ip;

  const repoExists = _.has(availableRepos, repoName);

  if (repoExists) {
    console.log('repo exists');
    const userExists = availableRepos[repoName].users[username];

    if (userExists) {
      console.log('userExists');
      userExists.activate();
    } else {
      console.log('creating new user');
      const aClient = new User(username, ip);
      availableRepos[repoName].addClient(aClient);
    }
  } else {
    console.log('creating new repo');
    const users = {};
    console.log('creating new user');
    users[username] = new User(username, ip);

    // create new repo with the new user
    availableRepos[repoName] = new RepoServer(repoName, users);
  }


  socket.on('disconnect', () => {
    const user = availableRepos[repoName].users[username];
    user.deactivate();
    console.log('client disconnected: ', username);
  });

  socket.on('files changed', (touchedFiles, currentBranch) => {
    availableRepos[repoName]
      .updateTouchedFiles(username, touchedFiles, currentBranch);
  });

  socket.on('branch changed', currentBranch => {
    _.noop(currentBranch);
    // aTeamServer.updateCurrentBranch(socket.id, currentBranch)
  });
});
