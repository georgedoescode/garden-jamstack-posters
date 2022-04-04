const CleanCSS = require('clean-css');
const { minify } = require('terser');

require('dotenv').config();

module.exports = function (eleventyConfig) {
  eleventyConfig.addPassthroughCopy('./src/fonts');

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

  eleventyConfig.addNunjucksAsyncFilter(
    'jsmin',
    async function (code, callback) {
      try {
        const minified = await minify(code);
        callback(null, minified.code);
      } catch (err) {
        console.error('Terser error: ', err);
        // Fail gracefully.
        callback(null, code);
      }
    }
  );

  return {
    dir: {
      input: 'src',
      output: 'dist',
    },
  };
};
