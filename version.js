import child_process from 'child_process';
import packageJSON from './package.json';

function commonVersionMaker() {
  return packageJSON.version;
}

function commitSHA1() {
  return child_process.execSync('git show -s --format=%H').toString().trim();
}

function commitSHA1Short() {
  return child_process.execSync('git show -s --format=%h').toString().trim();
}

export {
  commonVersionMaker,
  commitSHA1,
  commitSHA1Short,
}
