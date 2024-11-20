const path = require('path');

module.exports = {
    entry: {
        background: './js/background.js', // Adjust the path to your background script
        content: './js/content.js', // Adjust the path to your content script
        popup: './js/popup.js', // Adjust the path to your popup script
        auth: './js/auth.js', // Adjust the path to your popup script
        content_login: './js/content_login.js'
      },
  output: {
    path: path.resolve(__dirname, 'dist'),
    filename: '[name].bundle.js'
  },
  module: {
    rules: [
      {
        test: /\.js$/,
        exclude: /node_modules/,
        use: {
          loader: 'babel-loader',
          options: {
            presets: ['@babel/preset-env']
          }
        }
      }
    ]
  },
  mode: 'production' // Use 'development' for development mode (npm run build) -> run it
};
