const path = require('path');

module.exports = {
  mode: 'development',
  entry: path.join(__dirname, 'dist', 'index.js'),
  output: {
    path: path.join(__dirname, 'dist'),
    filename: 'canvas-image-editor.js',
    library: 'CanvasImageEditor',
    libraryTarget: 'window',
  },
  resolve: {
    extensions: ['.ts', '.js']
  },
  module: {
    rules: [
      {
        test: /\.ts$/,
        use: 'ts-loader',
        exclude: /node_modules/,
      },
    ],
  }
};