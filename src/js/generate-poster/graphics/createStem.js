const { Bezier } = require('bezier-js');
const { random, randomSnap } = require('@georgedoescode/generative-utils');

function drawCurve(curve) {
  const p = curve.points;

  if (p.length === 3) {
    return `Q ${p[1].x} ${p[1].y} ${p[2].x} ${p[2].y} `;
  } else {
    return `C ${p[1].x} ${p[1].y} ${p[2].x} ${p[2].y} ${p[3].x} ${p[3].y} `;
  }
}

function createStem(svg, x, y, width, height, colorPicker, background) {
  const dir1 = randomSnap(-width / 2, width / 2, width / 2);
  const size = height;

  const endY = y - size;
  const endX = x + randomSnap(-width / 2, width / 2, width / 2);

  const hasFlower = random(0, 1) > 0.5;

  const bezier = new Bezier(
    x,
    y,
    x,
    y - size * 0.33333,
    x + dir1,
    y - size * 0.66666,
    endX,
    endY
  );

  const outline = bezier.outline(width / 6, width / 6, width / 48, width / 48);

  let pathString = `M ${outline.curves[0].points[0].x} ${outline.curves[0].points[0].y} `;

  for (let i = 0; i < outline.curves.length; i++) {
    pathString += drawCurve(outline.curves[i]);
  }

  const fill = colorPicker.random();

  svg.path(pathString).fill(fill);

  if (hasFlower) {
    svg
      .circle(width / 8)
      .cx(endX)
      .cy(endY)
      .fill(fill);

    if (random(0, 1) > 0.5) {
      svg
        .circle(width / 16)
        .cx(endX)
        .cy(endY)
        .fill(background);
    }
  }
}

module.exports = createStem;
