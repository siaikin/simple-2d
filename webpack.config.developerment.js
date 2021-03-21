const path = require('path');
const webpack = require('webpack');
const CopyWebpackPlugin = require('copy-webpack-plugin');
const erudaWebpackPlugin = require('eruda-webpack-plugin');
const HTMLPlugin = require('html-webpack-plugin');
const { commonConfig, outputPath } = require('./sdk.config.js');

console.log(path.resolve(__dirname, './sample/index.html'));
const multiConfig = [
  {
    name: 'debug',
    entry: './index.ts',
    mode: "development",
    output: {
      path: path.resolve(__dirname, `${outputPath}/debug`),
      filename: `simple-2d.debug.js`,
      library: 'Simple2D',
      libraryTarget: 'umd',
    },
    devtool: "source-map",
    devServer: {
      https: true,
      host: '0.0.0.0',
      contentBase: path.join(__dirname, `${outputPath}/debug`),
      publicPath: '/'
    },
    plugins: [
      new CopyWebpackPlugin({
        patterns: [
          {
            from: path.resolve(__dirname, 'sample'),
            to: path.resolve(__dirname, `${outputPath}/debug`),
          }
        ],
      }),
      // new HTMLPlugin({
      //   template: './sample/index.html',
      //   hash: true,
      //   inject: 'head'
      // }),
      // new erudaWebpackPlugin({
      //   entry: /config\.js$/
      // })
    ]
  },
];

module.exports = (envArgs) => {
  let configs;
  if (!envArgs) {
    configs = multiConfig;
  } else {
    const enabledConfigNames = Object.keys(envArgs);
    const enabledConfigs = multiConfig.filter((config) => enabledConfigNames.includes(config.name));
    if (!enabledConfigs.length) {
      throw new Error(`找不到名为 ${JSON.stringify(enabledConfigNames)} 的配置. 可用的所有配置: ${multiConfig.map(config => config.name).join(', ')}`);
    }

    enabledConfigs.forEach(config => {
      const keys = Object.keys(commonConfig);
      for (let i = keys.length, key; i--;) {
        key = keys[i];
        if (config[key] instanceof Array &&
          commonConfig[key] instanceof Array) {
          config[key].push(...commonConfig[key])
        } else if (typeof config[key] === 'object') {
          config[key] = Object.assign({}, commonConfig[key], config[key]);
        } else if (config[key] === undefined) {
          config[key] = commonConfig[key];
        }
      }
    });
    configs = enabledConfigs;
  }

  console.log(`正在构建的配置: ${configs.map(config => config.name).join(', ')}.\n`);
  return configs;
};
