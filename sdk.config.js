const { getCommonConfig } = require('./webpack.config.common.js');
const { commonConfig, versionInfo } = getCommonConfig({
  patchset: 0,
  status: 8,
  redundant: 0
});

const config = {
  commonConfig,
  versionInfo,
  docName: 'simple-2d',
  outputPath: './output'
}

module.exports = config;
process.stdout.write(config.versionInfo.version);
