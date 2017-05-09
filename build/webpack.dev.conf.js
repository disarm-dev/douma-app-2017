var utils = require('./utils')
var webpack = require('webpack')
var config = require('../config')
var merge = require('webpack-merge')

var instance_configs = require('./multiple_configurations.js')
var HtmlWebpackPlugin = require('html-webpack-plugin')
var FriendlyErrorsPlugin = require('friendly-errors-webpack-plugin')


// add hot-reload related code to entry chunks
instance_configs.forEach((config) => {
  Object.keys(config.entry).forEach(function (name) {
    config.entry[name] = ['./build/dev-client'].concat(config.entry[name])
  })
})

var dev_config = {
  module: {
    rules: utils.styleLoaders({ sourceMap: config.dev.cssSourceMap })
  },
  // cheap-module-eval-source-map is faster for development
  devtool: '#cheap-module-eval-source-map',
  plugins: [
    new webpack.DefinePlugin({
      'process.env': config.dev.env
    }),
    // https://github.com/glenjamin/webpack-hot-middleware#installation--usage
    new webpack.HotModuleReplacementPlugin(),
    new webpack.NoEmitOnErrorsPlugin(),
    // https://github.com/ampedandwired/html-webpack-plugin
    new HtmlWebpackPlugin({
      filename: 'index.html',
      template: 'index.html',
      inject: true
    }),
    new FriendlyErrorsPlugin()
  ]
}

var merge_properties = {}

Object.keys(instance_configs).forEach(instance_key => {
  merge_properties[instance_key] = dev_config
})

module.exports = merge.multiple(merge_properties, instance_configs)
