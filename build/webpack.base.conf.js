var webpack = require('webpack')
var path = require('path')
var utils = require('./utils')
var config = require('../config')
var vueLoaderConfig = require('./vue-loader.conf')
var GitRevisionPlugin = require('git-revision-webpack-plugin')

var gitRevisionPlugin = new GitRevisionPlugin()

function resolve (dir) {
  return path.join(__dirname, '..', dir)
}

module.exports = {
  entry: {
    app: ['babel-polyfill', './src/index.js'],
  },
  output: {
    path: config.build.assetsRoot,
    filename: '[name].js',
    publicPath: process.env.NODE_ENV === 'production'
      ? config.build.assetsPublicPath
      : config.dev.assetsPublicPath
  },
  resolve: {
    extensions: ['.js', '.vue', '.json'],
    alias: {
      'vue$': 'vue/dist/vue.esm.js',
      '@': resolve('src'),
      'apps': resolve('src/apps'),
      'components': resolve('src/components'),
      'config': resolve('src/config'),
      'lib': resolve('src/lib'),
      'lib_instances': resolve('src/lib_instances'),
    }
  },
  module: {
    noParse: /(mapbox-gl)\.js$/, // Issue: https://github.com/mapbox/mapbox-gl-js/issues/4359
    rules: [
      {
        test: /\.vue$/,
        loader: 'vue-loader',
        options: vueLoaderConfig
      },
      {
        test: /\.js$/,
        loader: 'babel-loader',
        include: [resolve('src'), resolve('test')]
      },
      {
        test: /\.(png|jpe?g|gif|svg)(\?.*)?$/,
        loader: 'url-loader',
        options: {
          limit: 10000,
          name: utils.assetsPath('img/[name].[hash:7].[ext]')
        }
      },
      {
        test: /\.(woff2?|eot|ttf|otf)(\?.*)?$/,
        loader: 'url-loader',
        options: {
          limit: 10000,
          name: utils.assetsPath('fonts/[name].[hash:7].[ext]')
        }
      },
    ]
  },
  plugins: [
    new webpack.DefinePlugin({
      "VERSION_COMMIT_HASH_SHORT": JSON.stringify(gitRevisionPlugin.version()),
      'BRANCH': JSON.stringify(gitRevisionPlugin.branch()),
      "DOUMA_PRODUCTION_MODE": process.env.NODE_ENV === 'production'
    }),
    new GitRevisionPlugin() // Write VERSION and COMMITHASH files
  ]
}
