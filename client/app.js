"use strict";
var GitWatcher = require('./watcher');
var Client = require('./client');


var aClient = new Client('Or Tichon', '127.0.0.1');
var bClient = new Client('Roni Sabas', '127.0.0.2');

var aWatcher = new GitWatcher(aClient, 5000);

aClient.connectToSocketIoServer();
bClient.connectToSocketIoServer();
aWatcher.start();