const path = require('path');

module.exports = {
  entry: {
    main: './assets/src/index.js',
    gallery: './assets/src/gallery.js'
  },
  output: {
    filename: '[name].js',
    path: path.resolve(__dirname, 'assets')
  }
};
