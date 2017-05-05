var path = require('path')
var webpack = require('webpack')
var CopyWebpackPlugin = require('copy-webpack-plugin')
const SwPrecacheDevWebpackPlugin = require('sw-precache-webpack-dev-plugin')

var commitHash = require('child_process')
  .execSync('git rev-parse HEAD')
  .toString().replace(/\n/, '');

// add staticFileGlobs and filename for sw-precache-dev, for it to work
let swConfig = Object.assign({}, require('./sw-precache-config'), { staticFileGlobs: ['/*.js', '/**/*.html', '/assets/**.*'], filename: '/service-worker.js'})

// causes error during runtime
delete swConfig.importScripts

module.exports = {
  entry: ['whatwg-fetch', './src/index.js'],
  output: {
    path: path.resolve(__dirname, './dist'),
    publicPath: '/',
    filename: 'build.js'
  },
  module: {
    rules: [
      {
        test: /\.(eot|ttf|woff|woff2)$/,
        loader: 'file-loader'
      },
      {
        test: /\.css$/,
        loader: "style-loader!css-loader"
      },
      {
        test: /\.vue$/,
        loader: 'vue-loader',
        options: {
          // vue-loader options go here
        }
      },
      {
        test: /\.js$/,
        loader: 'babel-loader',
        exclude: /node_modules/
      },
      {
        test: /\.json$/,
        loader: 'json-loader',
        exclude: /node_modules/
      },
      {
        test: /\.(png|jpg|gif|svg|html)$/,
        loader: 'file-loader',
        options: {
          name: '[name].[ext]?[hash]'
        }
      }
    ]
  },
  resolve: {
    alias: {
      'vue$': 'vue/dist/vue',
      'jquery': "jquery/src/jquery.js",
      'handlebars': 'handlebars/dist/handlebars'
    }
  },
  devServer: {
    historyApiFallback: true,
    noInfo: true
  },
  devtool: '#eval-source-map',
  plugins: [
    new webpack.DefinePlugin({
      "COMMIT_HASH": JSON.stringify(commitHash),
      "DOUMA_DEV_MODE": process.env.NODE_ENV !== 'production',
      DOUMA_API_URL: "'https://douma-api.herokuapp.com'",
      DOUMA_API_VERSION: "'v2'",
      // DOUMA_API_URL: "'http://localhost:3000'",
      WEATHER_API_URL: "'https://weather.api.disarm.io/processor/output'",
      R_SERVER_URL: "'https://cluster.api.disarm.io'",
      COUNTRY_OPTIONS: JSON.stringify(require('./src/config/countries.json'))
    }),
    new SwPrecacheDevWebpackPlugin(swConfig)
  ]
}

if (process.env.NODE_ENV === 'production') {
  module.exports.devtool = '#eval' // TODO: @fix Make the sourcemap as small as possible (check docs for options)
  module.exports.resolve.alias['vue$'] = 'vue/dist/vue.min'
  module.exports.plugins = (module.exports.plugins || []).concat([
    new webpack.optimize.UglifyJsPlugin({
      compress: {
        warnings: false
      }
    }),
    new webpack.LoaderOptionsPlugin({
      minimize: true
    }),
    new CopyWebpackPlugin([
        { from: 'src/index.html', to: '200.html' }
    ]),
    new CopyWebpackPlugin([
        { from: 'src/assets', to: 'assets' },
        { from: 'src/CNAME' },
        { from: 'src/favicon.ico' },
        { from: 'src/manifest.json' },
        { from: 'src/index.html' },
        // needed for offline analytics
        { from: 'src/offline-analytics.js' },
        { from: 'node_modules/sw-offline-google-analytics/build/offline-google-analytics-import.min.js' },
    ]),
  ])
}
