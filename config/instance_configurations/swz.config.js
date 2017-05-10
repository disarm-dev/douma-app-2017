var path = require('path')
var config = require('../index.js')

module.exports = {
  entry: {
    app: './src/swz.js'
  },
  output: {
    path: path.join(config.build.assetsRoot, 'swz'),
  },
}