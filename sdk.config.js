import {commonVersionMaker, commitSHA1, commitSHA1Short} from './version.js';

const versionInfo = {
  version: commonVersionMaker(),
  gitHash: commitSHA1(),
  gitHashShort: commitSHA1Short(),
  buildTime: new Date().toISOString(),
};

const docName = 'simple-2d';
const outputPath = './output';

export {
  versionInfo,
  docName,
  outputPath
};
