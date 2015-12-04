/*
 * WEBPACK configuration
 * Creates 1 endpoint:
 *   - index.bundle.js - for overview page JS
 * Both endpoints copy over their respective static html files from ./src using
 * a require for the html and a file loader on .html files.
 *
 * SASS loader is used to load SCSS files.
 * LESS loader used for less files that are included as part of the bootstrap
 * import.
 * All styling is extracted using the ExtractText Plugin into "app.css"
 *
 * PNG files (logo) are inlined usng URL loader, as are .ttf, .woff, and .svg files.
 * EOT files are copied.
 *
 * Options:
 * webpack --minimize
 *   Create minified files using UglifyJS Plugin
 */
var webpack = require('webpack');
var minimize = process.argv.indexOf('--minimize') === -1 ? false : true;
var ExtractTextPlugin = require("extract-text-webpack-plugin");
var plugins = [];

plugins.push(new ExtractTextPlugin("app.css"));
if(minimize) {
  plugins.push(new webpack.optimize.UglifyJsPlugin());
}
module.exports = {
  context: __dirname + "/src",
  entry: {app:'./app.js'},
  output: {
    path: __dirname + '/build',
    filename: '[name].bundle.js'
  },
  debug: true,
  devtool: 'source-map',
  module: {
    loaders: [
      {
        test: /\.js$/,
        exclude: /node_modules/,
        loader: 'babel',
        query: {
          presets: ['react', 'es2015'],
          plugins: ['transform-runtime']
        }
      },
      // the url-loader uses DataUrls.
      // the file-loader emits files.
      {test: /\.(woff|woff2)(\?v=\d+\.\d+\.\d+)?$/, loader: 'url?limit=10000&mimetype=application/font-woff'},
      {test: /\.ttf(\?v=\d+\.\d+\.\d+)?$/, loader: 'url?limit=10000&mimetype=application/octet-stream'},
      {test: /\.eot(\?v=\d+\.\d+\.\d+)?$/, loader: 'file'},
      {test: /\.png(\?v=\d+\.\d+\.\d+)?$/, loader: 'url?limit=10000'},
      {test: /\.svg(\?v=\d+\.\d+\.\d+)?$/, loader: 'url?limit=10000&mimetype=image/svg+xml'},
      {
        test: /\.html$/,
        loader: "file?name=[name].[ext]"
      },
      {
        test: /\.scss$/, //loader: "style!css!sass"
        loader: ExtractTextPlugin.extract("style","css!sass")
      },
      {
        test: /\.css$/, //loader: "style!css!sass"
        loader: ExtractTextPlugin.extract("style","css")
      }
    ]
  },
  plugins: plugins
};
