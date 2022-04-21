const CleanCSS = require('clean-css');
const { minify } = require('terser');

require('dotenv').config();

module.exports = function (eleventyConfig) {
  eleventyConfig.addPassthroughCopy({
    './src/fonts/dm-sans-css': '/fonts/dm-sans',
  });

  eleventyConfig.addPassthroughCopy({
    './src/img/og-image.png': 'og-image.png',
  });

  eleventyConfig.addPassthroughCopy({ './src/img/favicon.ico': 'favicon.ico' });
  eleventyConfig.addPassthroughCopy({
    './src/img/favicon-16x16.png': 'favicon-16x16.png',
  });
  eleventyConfig.addPassthroughCopy({
    './src/img/favicon-32x32.png': 'favicon-32x32.png',
  });

  eleventyConfig.addFilter('cssmin', function (code) {
    return new CleanCSS({}).minify(code).styles;
  });

  return {
    dir: {
      input: 'src',
      output: 'dist',
    },
  };
};
