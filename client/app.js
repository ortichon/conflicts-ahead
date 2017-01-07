"use strict";
var GitWatcher = require('./watcher').GitWatcher;
var Client = require('./client').Client;


var aClient = new Client('Or Tichon', '127.0.0.1');
var aWatcher = new GitWatcher(aClient, 5000);

aWatcher.start();