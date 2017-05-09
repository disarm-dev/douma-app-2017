var path = require('path')
var config = require('../index.js')

module.exports = {
  entry: {
    app: './src/nam.js'
  },
  output: {
    path: path.join(config.build.assetsRoot, 'nam'),
  },
}