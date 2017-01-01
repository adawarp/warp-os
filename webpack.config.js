"use strict";

const isProduction = process.env.NODE_ENV === "production";
if (isProduction) {
  console.log("production build");
}
const path = require('path');

module.exports = {
  entry: './src/client/js/main.js',
  target: 'web',
  output: {
    filename: 'bundle.js',
    path: './src/client/'
  },
  module: {
    rules: [
      {
        enforce: 'pre',
        test: /\.jsx?$/,
        loader: 'eslint-loader',
        exclude: /node_modules|dist/
      }, {
        test: /\.jsx?$/,
        loader: 'babel-loader',
        exclude: /node_modules/
      }
    ]
  },
 devtool: isProduction ? '' : 'inline-source-map',
  resolve: {
    modules: [
      'node_modules'
    ]
  },
  devServer: {
    contentBase: path.join(__dirname, './src/client'),
    watchContentBase: true,
    compress: true,
    port: 9000
  },
  performance: {
    hints: false
  }
};
