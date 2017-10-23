// We are using node's native package 'path'
// https://nodejs.org/api/path.html
const path = require('path');
var webpack = require('webpack');

// Constant with our paths
const paths = {
  DIST: path.resolve(__dirname, 'library/dist'),
  JS: path.resolve(__dirname, 'library'),
};

// Webpack configuration
module.exports = {
  entry: {
    "solfege.bundle": path.join(paths.JS, 'solfege.js'),
    "solfege.bundle.min": path.join(paths.JS, 'dist/solfege.bundle.js'),
  },
  output: {
    path: paths.DIST,
    filename: '[name].js',
    library: "Solfege",
    libraryTarget: "umd"
  },
  module: {
    rules: [
      {
        test: /\.js$/,
        exclude: /node_modules/,
        use: {
          loader: 'babel-loader',
          options: {
            presets: ['env']
          }
        }
      }
    ]
  },
  plugins: [
    new webpack.optimize.UglifyJsPlugin({
      include: /\.min\.js$/,
      minimize: true
    })
  ]
};