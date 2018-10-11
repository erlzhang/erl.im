const path = require('path');

module.exports = {
  entry: {
    main: './src/index.js',
    gallery: './src/gallery.js',
    book: './src/book.js',
    home: './src/home.js',
    chart: './src/chart.js',
    comment: './src/comment.js'
  },
  output: {
    filename: '[name].js',
    path: path.resolve(__dirname, 'assets/js')
  }
};
