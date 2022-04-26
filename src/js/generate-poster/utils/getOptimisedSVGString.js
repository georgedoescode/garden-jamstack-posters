const { optimize } = require('svgo');

function getOptimisedSVGString(svg) {
  const svgString = svg.node.outerHTML;

  const result = optimize(svgString, {});
  const optimizedSvgString = result.data;

  return optimizedSvgString;
}

module.exports = getOptimisedSVGString;
