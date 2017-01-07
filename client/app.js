"use strict";
var GitWatcher = require('./watcher');
var Client = require('./client');


var aClient = new Client('Or Tichon', '127.0.0.1');
var aWatcher = new GitWatcher(aClient, 5000);

aClient.connectToSocketIoServer();
aWatcher.start();