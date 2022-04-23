const CleanCSS = require('clean-css');
const htmlmin = require('html-minifier');
const { optimize } = require('svgo');
const fs = require('fs');

require('dotenv').config();

function svgShortcode(path, classNames, attributes) {
  const svgData = fs.readFileSync(path).toString();

  if (classNames) {
    classNames = classNames.split(' ');
  }

  if (attributes) {
    attributes = attributes.split(' ');
  }

  const result = optimize(svgData, {
    plugins: [
      {
        name: 'addClassesToSVGElement',
        params: {
          classNames,
        },
      },
      {
        name: 'addAttributesToSVGElement',
        params: {
          attributes,
        },
      },
    ],
  }).data;

  return result;
}

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

  eleventyConfig.addWatchTarget('./src/css/global.css');

  eleventyConfig.addNunjucksShortcode('svg', svgShortcode);

  eleventyConfig.addFilter('cssmin', function (code) {
    return new CleanCSS({}).minify(code).styles;
  });

  eleventyConfig.addTransform('htmlmin', function (content, outputPath) {
    if (outputPath && outputPath.endsWith('.html')) {
      let minified = htmlmin.minify(content, {
        useShortDoctype: true,
        removeComments: true,
        collapseWhitespace: true,
      });
      return minified;
    }

    return content;
  });

  eleventyConfig.addTransform('cssmin', function (content, outputPath) {
    if (outputPath && outputPath.endsWith('.css')) {
      return new CleanCSS({}).minify(content).styles;
    }

    return content;
  });

  return {
    dir: {
      input: 'src',
      output: 'dist',
    },
  };
};
