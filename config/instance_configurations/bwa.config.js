var path = require('path')
var webpack = require('webpack')
var config = require('../index.js')

module.exports = {
  entry: {
    app: './src/bwa.js'
  },
  output: {
    path: path.join(config.build.assetsRoot, 'bwa'),
  }
}


