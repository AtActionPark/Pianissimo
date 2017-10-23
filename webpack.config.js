// We are using node's native package 'path'
// https://nodejs.org/api/path.html
const path = require('path');

// Constant with our paths
const paths = {
  DIST: path.resolve(__dirname, 'library/dist'),
  JS: path.resolve(__dirname, 'library'),
};

// Webpack configuration
module.exports = {
  entry: path.join(paths.JS, 'solfege.js'),
  output: {
    path: paths.DIST,
    filename: 'solfege.bundle.js',
    library: "Solfege",
    libraryTarget: "umd"
  },
};