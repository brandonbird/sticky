const webpack = require('webpack');
const path = require('path');

const config = {
  resolve: {
    extensions: ['.ts', '.webpack.js', '.web.js', '.js'],
    alias: {
      '@ngui/sticky': path.join(__dirname, '..', 'src', 'index')
    }
  },
  devtool: 'source-map',
  entry: './app/main.ts',
  module: {
    rules: [
      { 
        test: /\.ts$/, 
        include: [
          path.resolve(__dirname, '..', 'src'), 
          path.resolve(__dirname, '..', 'app')
        ],
        use: [
          'ts-loader',
          'angular2-template-loader'
        ],
      },
      { test: /\.html$/, use: 'raw' }
    ]
  },
  plugins: [],
  output: {
    path: `${__dirname}/build/`,
    publicPath: '/build/',
    filename: 'app.js'
  }
};

if (process.env.NODE_ENV === 'prod') {
  config.plugins = [
    new webpack.optimize.UglifyJsPlugin({ compress: { warnings: false } })
  ];
  config.module.rules.push({
    test: /\.ts$/, loader: 'strip-loader?strip[]=debug,strip[]=console.log'
  });
}

module.exports = config;
