var path = require('path')
var webpack = require('webpack')
var CopyWebpackPlugin = require('copy-webpack-plugin')

var commitHash = require('child_process')
  .execSync('git rev-parse HEAD')
  .toString();

module.exports = {
  entry: './src/index.js',
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
      // "DOUMA_API_URL": "'http://localhost:3000'"
      "DOUMA_API_URL": "'http://10.0.0.101:3000'"
      // "DOUMA_API_URL": "'https://douma-api.herokuapp.com'"
    })
  ]
}

if (process.env.NODE_ENV === 'production') {
  module.exports.devtool = '#cheap-source-map'
  // http://vue-loader.vuejs.org/en/workflow/production.html
  module.exports.plugins = (module.exports.plugins || []).concat([
    new webpack.DefinePlugin({
      'process.env': {
        NODE_ENV: '"production"',
        DOUMA_API_URL: "'https://douma-api.herokuapp.com'"
      }
    }),
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
    ]),
  ])
}
