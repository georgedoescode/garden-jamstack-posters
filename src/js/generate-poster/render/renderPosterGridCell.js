const { random, randomBias } = require('@georgedoescode/generative-utils');

const createFlower = require('../graphics/createFlower');
const createStem = require('../graphics/createStem');
const roundToDecimal = require('../../utils/roundToDecimal');

function renderPosterGridCell(svg, cell, type, colorPicker, background) {
  const cellCenter = {
    x: cell.x + cell.width / 2,
    y: cell.y + cell.height / 2,
  };

  const radius =
    Math.min(cell.width, cell.height) /
    roundToDecimal(randomBias(1, 4, 1, 1), 0.5);

  switch (type) {
    case 'flower':
      createFlower(
        svg,
        cellCenter.x,
        cellCenter.y,
        radius,
        colorPicker,
        background
      );
      break;
    case 'stem':
      createStem(
        svg,
        cellCenter.x,
        cell.y + cell.height,
        cell.width,
        cell.height,
        colorPicker,
        background
      );
      break;
    default:
      svg
        .circle(radius)
        .cx(cellCenter.x)
        .cy(cellCenter.y)
        .fill(colorPicker.random());

      if (random(0, 1) > 0.5) {
        svg
          .circle(radius / 2)
          .cx(cellCenter.x)
          .cy(cellCenter.y)
          .fill(background);
      }
      break;
  }
}

module.exports = renderPosterGridCell;
