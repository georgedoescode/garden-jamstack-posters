const { random, randomSnap } = require('@georgedoescode/generative-utils');
const { Glob, Node } = require('../utils/glob');

function createFlower(svg, x, y, size, colorPicker, background) {
  size /= 2;

  const centerRadius = size / 5;

  const centerNode = new Node({
    x,
    y,
    radius: centerRadius,
  });

  const numPoints = random(5, 8, true);
  const outerRadius = (size / numPoints) * 2;
  const angleStep = (Math.PI * 2) / numPoints;
  const radius = size;

  const group = svg.group();

  const outlineFlowers = random(0, 1) > 0.5;

  const fill = colorPicker.random();

  for (let i = 0; i < numPoints; i++) {
    const angle = i * angleStep;

    const x = centerNode.x + Math.cos(angle) * radius;
    const y = centerNode.y + Math.sin(angle) * radius;

    const currentNode = new Node({
      x,
      y,
      radius: outerRadius,
    });

    const glob = new Glob({
      start: centerNode,
      end: currentNode,
      a: 1,
      b: 1,
      aP: 1,
      bP: 1,
    });

    group.path(glob.buildPath()).fill(fill);

    if (outlineFlowers) {
      group
        .circle(outerRadius / 2)
        .cx(x)
        .cy(y)
        .fill(background);
    }
  }

  const scale = (radius * 2) / group.bbox().width;

  if (random(0, 1) > 0.5) {
    group.circle(centerRadius).cx(x).cy(y).fill(background);
  }

  group.scale(scale, x, y);
  group.rotate(randomSnap(0, 360, 30), x, y);
}

module.exports = createFlower;
