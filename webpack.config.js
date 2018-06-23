const path = require('path');
const CopyWebpackPlugin = require('copy-webpack-plugin');

module.exports = {
  mode: 'production',
  entry: [
    path.resolve('./src/components/index.js')
  ],
  output: {
    path: path.resolve('./build/'),
    filename: 'app.js',
    publicPath: '.'
  },
  module: {
    rules: [
      {
        test: /\.js/,
        include: path.resolve('./src/components/'),
        loader: 'babel-loader',
        options: {
          presets: ['es2015', 'react', 'stage-2'],
          plugins: ['transform-class-properties']
        }
      },
    ]
  },
  resolve: {
    extensions: ['.js']
  },
  plugins: [
    new CopyWebpackPlugin([
      { from: './manifest.json', to: 'manifest.json' },
      { from: './src/index.html', to: 'index.html' },
      { from: './src/devtools/devtools.html', to: 'devtools.html' },
      { from: './src/devtools/devtools.js', to: 'devtools.js' },
    ]),
  ],
};
