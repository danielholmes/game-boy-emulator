/* global __dirname */
const path = require('path')
const webpack = require('webpack')
const HtmlWebpackPlugin = require('html-webpack-plugin')
const CleanWebpackPlugin = require('clean-webpack-plugin')

module.exports = {
  context: __dirname,

  mode: 'development',
  devtool: 'inline-source-map',

  entry: {
    public: [
      '@babel/polyfill',
      './src/index'
    ]
  },

  output: {
    path: path.resolve(__dirname, 'dist'),
    filename: '[name]-[hash].js',
    publicPath: 'http://localhost:3000/'
  },

  module: {
    rules: [
      {
        test: /\.(gif|png|jpg)$/,
        loader: 'url-loader?mimetype=image/png'
      },
      {
        test: /(\.js|\.tsx?)$/,
        exclude: /node_modules/,
        loader: 'babel-loader'
      }
    ]
  },

  resolve: {
    modules: ['node_modules'],
    extensions: ['.js', '.ts', '.tsx']
  },

  plugins: [
    new CleanWebpackPlugin({
      cleanOnceBeforeBuildPatterns: ['dist']
    }),
    new HtmlWebpackPlugin(),
    new webpack.NoEmitOnErrorsPlugin()
  ],
}