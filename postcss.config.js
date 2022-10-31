const tailwindcss = require('tailwindcss');

module.exports = {
  plugins: [
    'postcss-preset-env',
    require('./tailwind.config.js'),
    tailwindcss,
    require('autoprefixer'),
  ],
};
