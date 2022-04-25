const { random } = require('@georgedoescode/generative-utils');
const { Glob, Node } = require('../utils/glob');

function createSun(svg, x, y, radius, colorPicker, background) {
  radius /= 2;
  radius -= 8;

  const numPoints = random(8, 16, true);
  const angleStep = (Math.PI * 2) / numPoints;
  const outlineRays = random(0, 1) > 0.5;

  const scalar = 1.5;

  const fill = colorPicker.random();

  for (let i = 0; i < numPoints; i++) {
    const angle = i * angleStep;

    const x1 = x + (Math.cos(angle) * radius) / 2;
    const y1 = y + (Math.sin(angle) * radius) / 2;

    const x2 = x + (Math.cos(angle) * radius) / scalar;
    const y2 = y + (Math.sin(angle) * radius) / scalar;

    const startNode = new Node({
      x: x1,
      y: y1,
      radius: 4,
    });

    const endNode = new Node({
      x: x2,
      y: y2,
      radius: 12,
    });

    const glob = new Glob({
      start: startNode,
      end: endNode,
    });

    svg.path(glob.buildPath()).fill(fill);

    if (outlineRays) {
      svg.circle(8).cx(x2).cy(y2).fill(background);
    }
  }

  svg
    .circle(radius * 0.75)
    .cx(x)
    .cy(y)
    .fill(fill);

  svg
    .circle(radius * 0.25)
    .cx(x)
    .cy(y)
    .fill(background);
}

module.exports = createSun;
