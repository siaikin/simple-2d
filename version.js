const child_process = require('child_process');
const packageJSON = require('./package.json');

function commonVersionMaker() {
  return packageJSON.version;
}

function commitSHA1() {
  return child_process.execSync('git show -s --format=%H').toString().trim();
}

function commitSHA1Short() {
  return child_process.execSync('git show -s --format=%h').toString().trim();
}

module.exports = {
  commonVersionMaker,
  commitSHA1,
  commitSHA1Short,
}
