const { createSVGWindow } = require('svgdom');
const { SVG, registerWindow } = require('@svgdotjs/svg.js');
const { random } = require('@georgedoescode/generative-utils');

class BackgroundSplodges {
  data() {
    return {
      permalink: `/background-splodges.svg`,
    };
  }

  render(data) {
    const width = 1920;
    const height = 1080;

    const window = createSVGWindow();
    const document = window.document;

    registerWindow(window, document);

    const svg = SVG(document.documentElement).viewbox(0, 0, width, height);

    for (let i = 0; i < 24; i++) {
      svg
        .circle(random(1, 8))
        .cx(random(0, width))
        .cy(random(0, height))
        .fill(random(['#132A21', '#479575', '#E2505E', '#EEAFB8', '#F7A546']));
    }

    return svg.node.outerHTML;
  }
}

module.exports = BackgroundSplodges;
