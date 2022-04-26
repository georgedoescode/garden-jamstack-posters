const CleanCSS = require('clean-css');
const { optimize } = require('svgo');
const fs = require('fs');

require('dotenv').config();

function svgShortcode(path, classNames, attributes) {
  const svgData = fs.readFileSync(path).toString();

  const plugins = [];

  if (classNames) {
    classNames = classNames.split(' ');

    plugins.push({
      name: 'addClassesToSVGElement',
      params: {
        classNames,
      },
    });
  }

  if (attributes) {
    attributes = attributes.split(' ');

    plugins.push({
      name: 'addAttributesToSVGElement',
      params: {
        attributes,
      },
    });
  }

  const result = optimize(svgData, {
    plugins,
  }).data;

  return result;
}

module.exports = function (eleventyConfig) {
  eleventyConfig.addPassthroughCopy({
    './src/fonts/dm-sans-css': '/fonts/dm-sans',
  });

  eleventyConfig.addPassthroughCopy({
    './src/images/social/og-image.png': 'og-image.png',
  });

  eleventyConfig.addPassthroughCopy({
    './src/images/favicons': '/',
  });

  eleventyConfig.addWatchTarget('./src/css');

  eleventyConfig.addNunjucksShortcode('svg', svgShortcode);

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
