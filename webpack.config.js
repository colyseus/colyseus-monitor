const webpack = require('webpack');
const path = require('path');

const HtmlWebpackPlugin = require('html-webpack-plugin');
const ExtractTextPlugin = require("extract-text-webpack-plugin");

const pkg = require('./package.json');

module.exports = function(options) {
  if (!options) options = {};

  const MODE = (options.production)
    ? "production"
    : "development";

  return {
    mode: MODE,

    entry: path.resolve("src", "frontend", "index.tsx"),

    output: {
      path: __dirname + "/build/static",
      filename: 'bundle.js'
    },

    devtool: 'cheap-source-map',

    module: {
      rules: [
        { test: /\.tsx?$/, loader: "ts-loader" },
        { test: /\.css$/, loader: ExtractTextPlugin.extract({ fallback: "style-loader", use: "css-loader" }) },
        { test: /\.(woff|woff2|eot|ttf|svg)$/, loader: 'file-loader?limit=1024&name=[name].[ext]' },
        { test: /\.mjs$/, include: /node_modules/, type: 'javascript/auto' },
      ]
    },

    plugins: [
      new webpack.DefinePlugin({
        'process.env.npm_package_version': JSON.stringify(pkg.version),
      }),
      new ExtractTextPlugin("styles.css"),
      new HtmlWebpackPlugin({
        template: path.resolve("src", "frontend", "index.html")
      }),
    ],

    resolve: {
      extensions: ['.ts', '.tsx', '.js', '.json']
    }

  }
};
