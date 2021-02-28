const path = require('path');
const CopyWebpackPlugin = require('copy-webpack-plugin');
const { CleanWebpackPlugin } = require('clean-webpack-plugin');

function _externals() {
  let manifest = require('../package.json');
  let dependencies = manifest.devDependencies;
  let externals = {};
  for (let p in dependencies) {
    externals[p] = 'commonjs ' + p;
  }
  return externals;
}

const externals = _externals();

module.exports = {
  mode: 'production',
  entry: path.resolve('src/main/index.ts'),
  // devtool: 'inline-source-map',
  output: {
    path: path.resolve('dist'),
    filename: 'index.js'
  },
  module: {
    rules: [
      {
        test: /\.tsx?$/,
        use: 'ts-loader',
        exclude: /node_modules/
      }
    ]
  },
  resolve: {
    extensions: ['.ts', '.js'],
  },
  externals,
  target: 'node',
  plugins: [
    new CleanWebpackPlugin(),
    new CopyWebpackPlugin({
      patterns: [
        { from: 'src/main/resources', to: 'resources', noErrorOnMissing: true },
      ]
    })
  ]
};
