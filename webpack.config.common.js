const path = require('path');
const webpack = require('webpack');
const {commonVersionMaker, commitSHA1, commitSHA1Short} = require('./version.js');
const BundleAnalyzerPlugin = require('webpack-bundle-analyzer').BundleAnalyzerPlugin;
const ESLintPlugin = require('eslint-webpack-plugin');

/**
 * @desc 获取基本 webpack 配置
 * @param {Object} options
 * @param {number} [options.patchset] - 修订号
 * @param {number} [options.status] - 先行版本号
 */
function getCommonConfig(options = {}) {
  options.patchset = options.patchset === undefined ? DEFAULT_VERSION_PATCHSET :options.patchset;
  options.status = options.status === undefined ? DEFAULT_VERSION_STATUS :options.status;

  // 版本信息
  const versionInfo = {
    version: commonVersionMaker(),
    gitHash: commitSHA1(),
    gitHashShort: commitSHA1Short(),
    buildTime: new Date().toISOString(),
  };

  const commonConfig = {
    module: {
      rules: [
        {
          test: /\.m?js$/,
          exclude: /(node_modules|bower_components)/,
          use: {
            loader: 'babel-loader',
            options: {
              presets: ['@babel/preset-env'],
              plugins: ['@babel/plugin-proposal-class-properties']
            }
          }
        },
        {
          test: /\.tsx?$/,
          exclude: /(node_modules|bower_components)/,
          use: 'ts-loader'

        }
      ]
    },
    optimization: {
      sideEffects: true,
      minimize: true
    },
    plugins: [
      /* 定义 `VERSION_INFO` 全局变量，保存版本信息 */
      new webpack.DefinePlugin({
        VERSION_INFO: JSON.stringify(versionInfo)
      }),
      /* 在编译后的文件中添加版本信息的注释 */
      new webpack.BannerPlugin(`version: ${versionInfo.version} ${versionInfo.versionNumber}\ngit-hash: ${versionInfo.gitHash} [${versionInfo.gitHashShort}]\nbuild time: ${versionInfo.buildTime}`),
      /* todo SDK编译文件增加忽略lint检查注释 */
      /* eslint-disable */
      /* jshint ignore */
      /* ignore jslint start*/
      // new BundleAnalyzerPlugin({
      //   analyzerMode: 'static',
      //   openAnalyzer: false
      // })
      new ESLintPlugin({
        extensions: [ '.tsx', '.ts', '.js' ],
      }),
    ],
    resolve: {
      extensions: [ '.tsx', '.ts', '.js' ],
    }
  };

  return {
    commonConfig,
    versionInfo
  };
}

module.exports = {
  getCommonConfig
}
