const { createSVGWindow } = require('svgdom');
const { SVG, registerWindow } = require('@svgdotjs/svg.js');
const {
  random,
  randomBias,
  seedPRNG,
} = require('@georgedoescode/generative-utils');
const { Vector2D } = require('@georgedoescode/vector2d');
const { optimize } = require('svgo');

const roundToDecimal = require('../utils/roundToDecimal');
const createColorPicker = require('./createColorPicker');
const createFlower = require('./createFlower');
const createSun = require('./createSun');
const createStem = require('./createStem');
const createGrid = require('./createGrid');

const dmSansEncoded = require('../../fonts/dm-sans-encoded');

const BASE_SEED = 'Like a circle round the sun';

function generatePoster(seed, colorTokens, theme) {
  const width = 768;
  const height = 1024;

  const window = createSVGWindow();
  const document = window.document;

  registerWindow(window, document);

  const svg = SVG(document.documentElement).viewbox(0, 0, width, height);

  const background = theme === 'dark' ? colorTokens.greenDark : '#fff';

  svg.node.innerHTML += `
    <defs>
        <style>
          ${dmSansEncoded}
        </style>
    </defs>
  `;

  const colors = [
    theme === 'dark' ? colorTokens.greenLight : colorTokens.greenDark,
    theme === 'dark' ? colorTokens.greenLight : colorTokens.greenDark,
    theme === 'dark' ? colorTokens.greenLight : colorTokens.greenDark,
    theme === 'dark' ? colorTokens.greenLight : colorTokens.greenDark,
    colorTokens.greenBase,
    colorTokens.redBase,
    colorTokens.pinkBase,
    colorTokens.yellowBase,
  ];

  const colorPicker = createColorPicker(colors);

  const textColor =
    theme === 'dark' ? colorTokens.greenLight : colorTokens.greenDark;

  const cellFillChance = 0.125;
  const bottomPadding = 128 + 24;
  const gridPadding = 64;

  seedPRNG(BASE_SEED + seed);

  svg.rect(width, height).fill(background);

  const { areas } = createGrid(width, height - bottomPadding, gridPadding);

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
      colorPicker,
      background
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
      fill: textColor,
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
      Math.min(cell.width, cell.height) /
      roundToDecimal(randomBias(1, 4, 1, 1), 0.5);

    switch (renderChoice) {
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

  const allColorsPresentInPoster = [...Array.from(colorPicker.getStore())];

  for (let i = 0; i < allColorsPresentInPoster.length; i++) {
    svg
      .circle(24)
      .x(width - gridPadding - 24)
      .y(height - gridPadding - 24)
      .stroke({
        width: 2,
        color: background,
      })
      .fill(allColorsPresentInPoster[i])
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
