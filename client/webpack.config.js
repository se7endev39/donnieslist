const webpack = require('webpack');
const path = require('path');
const ExtractTextPlugin = require('extract-text-webpack-plugin');

const config = {
  context: __dirname,
  entry: './src/index.js',
  output: {
    path: __dirname,
    filename: 'bundle.js',
  },
  module: {
    loaders: [{
      exclude: /node_modules/,
      test: /\.(js|jsx)$/,
      loader: 'babel',
    },
      {
        test: /\.(scss|css)$/,
        loader: ExtractTextPlugin.extract('css!sass'),
      },
      { test: /\.json$/, loader: "json-loader" }
        ],
  },
  devServer: {
    disableHostCheck: true,
    historyApiFallback: true,
    contentBase: './',
  },
  plugins: [
    new webpack.DefinePlugin({ 'process.env': { NODE_ENV: JSON.stringify('production') } }),
    new webpack.optimize.DedupePlugin(),
    new webpack.optimize.OccurenceOrderPlugin(),
    new ExtractTextPlugin('src/public/stylesheets/app.css', {
      allChunks: true,
    }),
  ],
};

module.exports = config;
