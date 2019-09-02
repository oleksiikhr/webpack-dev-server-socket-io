'use strict'

const MiniCssExtractPlugin = require('mini-css-extract-plugin')
const { CleanWebpackPlugin } = require('clean-webpack-plugin')
const HtmlWebpackPlugin = require('html-webpack-plugin')
const files = require('./core/files')
const path = require('path')

/**
 * Is build for Production
 * @type {boolean}
 */
const isProd = process.argv.includes('production')

/*
 * In development mode, we connect our own websocket server
 */
if (!isProd) {
  require('./core/statistics')
  require('./core/watch')
}

module.exports = {
  entry: [
    './src/index.js',
    './src/styles/index.css'
  ],
  output: {
    filename: '[name].[hash].js',
    path: path.resolve(__dirname, 'dist')
  },
  module: {
    rules: [
      {
        test: /\.css$/,
        use: [
          MiniCssExtractPlugin.loader,
          'css-loader'
        ]
      },
      {
        test: /\.js$/,
        use: [
          'babel-loader'
        ]
      }
    ]
  },
  plugins: [
    /**
     * Remove build folder before building.
     * @see https://github.com/johnagan/clean-webpack-plugin
     */
    new CleanWebpackPlugin(),
    /**
     * Simplifies creation of HTML files to serve your webpack bundles.
     * @see https://github.com/jantimon/html-webpack-plugin
     */
    new HtmlWebpackPlugin({
      filename: 'index.html',
      template: './src/index.ejs',
      templateParameters: {
        files: files(),
        isProd
      }
    }),
    /**
     * This plugin extracts CSS into separate files.
     * It creates a CSS file per JS file which contains CSS.
     * @see https://github.com/webpack-contrib/mini-css-extract-plugin
     */
    new MiniCssExtractPlugin({
      chunkFilename: 'static/css/[name].[hash].css',
      filename: 'static/[name].[hash].css'
    })
  ]
}
