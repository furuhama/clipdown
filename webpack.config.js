const path = require('path');

module.exports = {
  entry: {
    background: './src/background/background.ts',
    content: './src/content/content.ts'
  },
  module: {
    rules: [
      {
        test: /\.ts$/,
        use: 'ts-loader',
        exclude: /node_modules/
      }
    ]
  },
  resolve: {
    extensions: ['.ts', '.js']
  },
  mode: 'development',
  devtool: 'inline-source-map',
  optimization: {
    minimize: false,
    concatenateModules: false,
    splitChunks: false
  },
  performance: {
    hints: false
  },
  output: {
    path: path.resolve(__dirname, 'dist'),
    filename: '[name].js',
    pathinfo: true
  }
};
