const webpack = require('webpack');
const path = require('path');

module.exports = {
  mode: 'development',
  entry: './src/index.tsx',
  output: {
      path: path.join(__dirname, './public/'),
      publicPath: '/',
      filename: 'dist/bundle.js'
  },
  plugins: [new webpack.optimize.OccurrenceOrderPlugin(), new webpack.NoEmitOnErrorsPlugin()],
  resolve: {
      extensions: ['.tsx', '.ts', '.js']
  },
  module: {
      rules: [
          { test: /\.tsx$/,
            loader: 'ts-loader',
            exclude: /node_modules/},
          { test: /\.css$/, use: ['style-loader','css-loader']}
      ]
  }
};