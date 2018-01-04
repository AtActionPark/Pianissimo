// We are using node's native package 'path'
// https://nodejs.org/api/path.html
const path = require('path');
const webpack = require('webpack');

// Constant with our paths
const paths = {
  DIST: path.resolve(__dirname, 'dist'),
  JS: path.resolve(__dirname, ''),
};

// Webpack configuration
module.exports = {
  entry: {
    'pianissimo.bundle': path.join(paths.JS, 'pianissimo.js'),
    'pianissimo.bundle.min': path.join(paths.JS, 'dist/pianissimo.bundle.js'),
  },
  output: {
    path: paths.DIST,
    filename: '[name].js',
    library: 'pianissimo',
    libraryTarget: 'umd',
  },
  module: {
    rules: [
      {
        test: /\.js$/,
        exclude: /node_modules/,
        use: {
          loader: 'babel-loader',
          options: {
            presets: ['env'],
          },
        },
      },
    ],
  },
  plugins: [
    new webpack.optimize.UglifyJsPlugin({
      include: /\.min\.js$/,
      minimize: true,
    }),
  ],
};
