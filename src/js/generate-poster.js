const { createSVGWindow } = require('svgdom');
const { SVG, registerWindow } = require('@svgdotjs/svg.js');
const {
  random,
  randomBias,
  randomSnap,
  seedPRNG,
  createQtGrid,
} = require('@georgedoescode/generative-utils');
const { Vector2D } = require('@georgedoescode/vector2d');
const { optimize } = require('svgo');

const { Glob, Node } = require('./glob');
const { Bezier } = require('bezier-js');

const dmSansEncoded = require('../fonts/dm-sans-encoded');

const BASE_SEED = 'Like a circle round the sun';

const background = '#fff';

const colorStore = new Set();

function pickColor(colors) {
  const choice = random(colors);
  colorStore.add(choice);

  return choice;
}

function createSun(svg, x, y, radius, colors) {
  radius /= 2;
  radius -= 8;

  const numPoints = random(8, 16, true);
  const angleStep = (Math.PI * 2) / numPoints;
  const outlineRays = random(0, 1) > 0.5;

  const scalar = 1.5;

  const fill = pickColor(colors);

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

function createStem(svg, x, y, width, height, colors) {
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

  const drawCurve = (curve) => {
    const p = curve.points;

    if (p.length === 3) {
      return `Q ${p[1].x} ${p[1].y} ${p[2].x} ${p[2].y} `;
    } else {
      return `C ${p[1].x} ${p[1].y} ${p[2].x} ${p[2].y} ${p[3].x} ${p[3].y} `;
    }
  };

  for (let i = 0; i < outline.curves.length; i++) {
    pathString += drawCurve(outline.curves[i]);
  }

  const fill = pickColor(colors);

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

function createFlower(svg, x, y, size, colors) {
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

  const fill = pickColor(colors);

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

function round(value, step) {
  step || (step = 1.0);
  var inv = 1.0 / step;
  return Math.round(value * inv) / inv;
}

function generatePoster(seed, colorTokens) {
  const width = 768;
  const height = 1024;

  const window = createSVGWindow();
  const document = window.document;

  registerWindow(window, document);

  const svg = SVG(document.documentElement).viewbox(0, 0, width, height);

  svg.node.innerHTML += `
    <defs>
        <style>
          ${dmSansEncoded}
        </style>
    </defs>
  `;

  const colors = [
    colorTokens.greenDark,
    colorTokens.greenDark,
    colorTokens.greenDark,
    colorTokens.greenDark,
    colorTokens.greenBase,
    colorTokens.redBase,
    colorTokens.pinkBase,
    colorTokens.yellowBase,
  ];

  const cellFillChance = 0.125;
  const bottomPadding = 128 + 24;
  const gridPadding = 64;

  colorStore.clear();

  seedPRNG(BASE_SEED + seed);

  svg.rect(width, height).fill(background);

  const grid = createGrid(width, height - bottomPadding, gridPadding);
  const { areas } = grid;

  let lastChoice;

  if (random(0, 1) > 0.5) {
    const largestArea = [...areas].sort(
      (a, b) => b.width * b.height - a.width * a.height
    )[0];

    createSun(
      svg,
      largestArea.x + largestArea.width / 2,
      largestArea.y + largestArea.height / 2,
      Math.min(largestArea.width, largestArea.height),
      colors
    );

    largestArea.taken = true;

    lastChoice = largestArea;
  }

  svg
    .text(`“Garden” — ${seed.split('-').join('/')}`)
    .font({
      size: 24,
      family: 'DM Sans',
      weight: 700,
      leading: 1,
      fill: '#132A21',
    })
    .x(gridPadding)
    .y(height - gridPadding - 29);

  let lastOption = '';

  for (let i = 0; i < areas.length; i++) {
    if (random(0, 1) < cellFillChance) continue;

    const options = areas.filter((a) => !a.taken);

    if (!options.length) break;

    if (!lastChoice) {
      lastChoice = random(options);
    }

    const optionsSortedByDist = [...options].sort(
      (a, b) =>
        Vector2D.dist(
          new Vector2D(
            lastChoice.x + lastChoice.width / 2,
            lastChoice.y + lastChoice.height / 2
          ),
          new Vector2D(a.x + a.width / 2, a.y + a.height / 2)
        ) -
        Vector2D.dist(
          new Vector2D(
            lastChoice.x + lastChoice.width / 2,
            lastChoice.y + lastChoice.height / 2
          ),
          new Vector2D(b.x + b.width / 2, b.y + b.height / 2)
        )
    );

    const renderOptions = ['circle', 'stem', 'flower'].filter(
      (o) => o !== lastOption
    );
    const renderChoice = random(renderOptions);

    lastOption = renderChoice;

    const cell = optionsSortedByDist[optionsSortedByDist.length - 1];
    cell.taken = true;
    lastChoice = cell;

    const cellCenter = {
      x: cell.x + cell.width / 2,
      y: cell.y + cell.height / 2,
    };

    const radius =
      Math.min(cell.width, cell.height) / round(randomBias(1, 4, 1, 1), 0.5);

    switch (renderChoice) {
      case 'flower':
        createFlower(svg, cellCenter.x, cellCenter.y, radius, colors);
        break;
      case 'stem':
        createStem(
          svg,
          cellCenter.x,
          cell.y + cell.height,
          cell.width,
          cell.height,
          colors
        );
        break;
      default:
        const color = pickColor(colors);

        svg.circle(radius).cx(cellCenter.x).cy(cellCenter.y).fill(color);

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

  const dummyColors = [...Array.from(colorStore)];

  for (let i = 0; i < dummyColors.length; i++) {
    svg
      .circle(24)
      .x(width - gridPadding - 24)
      .y(height - gridPadding - 24)
      .stroke({
        width: 2,
        color: background,
      })
      .fill(dummyColors[i])
      .translate(-i * 16, 0);
  }

  svg.node.style.setProperty('-webkit-font-smoothing', 'antialiased');
  svg.node.style.setProperty('-moz-osx-font-smoothing', 'grayscale');

  const svgString = svg.node.outerHTML;

  const result = optimize(svgString, {});
  const optimizedSvgString = result.data;

  return optimizedSvgString;
}

module.exports = { generatePoster };
