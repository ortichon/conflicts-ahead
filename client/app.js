var git = require('simple-git');
var _ = require('lodash');


var diffObj = {
  touchedFiles: [],
  currentBranch: ''
};

main();
setInterval(main, 5000);




function updatedTouchedFiles(fileString) {
  var fileList = fileString.split('\n');
  fileList =  _.compact(fileList);
  if (!_.isEqual(fileList, diffObj.touchedFiles)) {
    diffObj.touchedFiles = fileList;
    console.log('touchedFiles: ', diffObj.touchedFiles);
  }
}

function updateBranchName(branchName) {
  if (!_.isEqual(branchName, diffObj.currentBranch)) {
    diffObj.currentBranch = branchName;
    console.log('working branch: ', diffObj.currentBranch);
  }
}

function getTouchedFilesList() {
  git().diff(['--name-only'], function(err, res) {
    if (err) {
      console.error('error: ', err);
    } else {
      updatedTouchedFiles(res);
    }
  });
}

function getCurrentBranchName() {
  git().revparse(['--abbrev-ref', 'HEAD'], function(err, res) {
    if (err) {
      console.error('error: ', err);
    } else {
      updateBranchName(res);
    }
  })
}

function main() {
  getTouchedFilesList();
  getCurrentBranchName();
}