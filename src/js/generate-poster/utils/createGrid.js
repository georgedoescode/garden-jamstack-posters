const {
  randomBias,
  randomSnap,
  createQtGrid,
} = require('@georgedoescode/generative-utils');

function createGrid(width, height, gap) {
  gap /= 2;

  const focus = {
    x: randomSnap(0, width, width / 2),
    y: randomSnap(0, height, height / 2),
  };

  const points = [...Array(40)].map(() => {
    return {
      x: randomBias(0, width, focus.x, 1),
      y: randomBias(0, height, focus.y, 1),
      width: 1,
      height: 1,
    };
  });

  const grid = createQtGrid({
    width: width - gap * 2,
    height: height - gap * 2,
    points,
    gap,
    maxQtLevels: 2,
  });

  grid.areas.forEach((a) => {
    a.x += gap;
    a.y += gap;
  });

  return grid;
}

module.exports = createGrid;
