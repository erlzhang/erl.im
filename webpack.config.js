const path = require('path');

module.exports = {
  entry: {
    main: './src/index.js',
    gallery: './src/gallery.js',
    book: './src/book.js',
    post: './src/post.js',
    chart: './src/chart.js'
  },
  output: {
    filename: '[name].js',
    path: path.resolve(__dirname, 'assets/js')
  }
};
