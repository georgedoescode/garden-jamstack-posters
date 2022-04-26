const { createSVGWindow } = require('svgdom');
const { SVG, registerWindow } = require('@svgdotjs/svg.js');
const { random, seedPRNG } = require('@georgedoescode/generative-utils');

const createColorPicker = require('./utils/createColorPicker');
const embedSVGFont = require('./utils/embedSVGFont');
const findFurthestGridCell = require('./utils/findFurthestGridCell');
const renderPosterGridCell = require('./render/renderPosterGridCell');
const renderPosterColors = require('./render/renderPosterColors');
const renderPosterText = require('./render/renderPosterText');
const createSun = require('./graphics/createSun');
const createGrid = require('./utils/createGrid');
const getOptimisedSVGString = require('./utils/getOptimisedSVGString');

const dmSansEncoded = require('../../fonts/dm-sans-encoded');

const BASE_SEED = 'Like a circle round the sun';

function generatePoster(seed, colorTokens, theme) {
  // Seed all random functions from generative-utils using the base seed + poster date
  seedPRNG(BASE_SEED + seed);

  // Viewbox width and height
  const width = 768;
  const height = 1024;

  const window = createSVGWindow();
  const document = window.document;

  registerWindow(window, document);

  const svg = SVG(document.documentElement).viewbox(0, 0, width, height);

  // Embed a base64 encoded version of DM Sans
  embedSVGFont(dmSansEncoded, svg);

  // Define the poster background color
  const backgroundColor = theme === 'dark' ? colorTokens.greenDark : '#fff';
  // Define the poster primary color (used for the majority of graphics and text)
  const primaryColor =
    theme === 'dark' ? colorTokens.greenLight : colorTokens.greenDark;

  // Color object store
  const colors = {
    background: backgroundColor,
    primary: primaryColor,
    palette: [
      colorTokens.greenBase,
      colorTokens.redBase,
      colorTokens.pinkBase,
      colorTokens.yellowBase,
    ],
  };

  // We want out color palette to be weighted, featuring more of our neutral primary color
  for (let i = 0; i < 4; i++) {
    colors.palette.unshift(primaryColor);
  }

  // Exposes a random() and getStore() function, getStore will return all picked colors
  const colorPicker = createColorPicker(colors.palette);

  // Poster config options
  const cellFillChance = 0.125;
  const bottomPadding = 128 + 24;
  const gridPadding = 64;

  // Render the poster background
  svg.rect(width, height).fill(colors.background);

  // Create a random quadtree grid
  const { areas } = createGrid(width, height - bottomPadding, gridPadding);

  // Track the last chosen cell so that we can use it to help determine the next one
  let previousCellChoice;

  // Should we render a sun in this poster?
  const renderSun = random(0, 1) > 0.5;

  // Render the sun!
  if (renderSun) {
    // Find the largest grid area to plop the sun in
    const largestArea = [...areas].sort(
      (a, b) => b.width * b.height - a.width * a.height
    )[0];

    // Add the sun to the largest grid area
    createSun(
      svg,
      largestArea.x + largestArea.width / 2,
      largestArea.y + largestArea.height / 2,
      Math.min(largestArea.width, largestArea.height),
      colorPicker,
      colors.background
    );

    // Update previousCellChoice
    previousCellChoice = largestArea;
    previousCellChoice.taken = true;
  }

  /* 
    Track the last object (stem, flower, circle) we rendered so that we don't repeat any,
    this helps form a more balanced composition.
  */
  let lastRenderOption = '';

  for (let i = 0; i < areas.length; i++) {
    // Sometimes, render nothing
    if (random(0, 1) < cellFillChance) continue;

    // Get all cells that don't have an object in them
    const cellOptions = areas.filter((a) => !a.taken);

    // If there are no remaining cells, exit out of the render loop
    if (!cellOptions.length) break;

    // This is the first cell to render (we haven't drawn a sun in this poster)
    if (!previousCellChoice) {
      previousCellChoice = random(cellOptions);
    }

    // Choose a random render option, but not the same as the last one
    const renderOptions = ['circle', 'stem', 'flower'].filter(
      (o) => o !== lastRenderOption
    );

    const renderChoice = random(renderOptions);
    lastRenderOption = renderChoice;

    /* 
      For each new cell, find the cell that is furthest from the previous choice,
      this helps create a more balanced composition
    */
    const cell = findFurthestGridCell(previousCellChoice, cellOptions);
    cell.taken = true;
    previousCellChoice = cell;

    // Render a flower, stem, or circle iin this grid cell
    renderPosterGridCell(
      svg,
      cell,
      renderChoice,
      colorPicker,
      colors.background
    );
  }

  // Render the poster title (Garden - Seed)
  renderPosterText(svg, seed, colors.primary, height, gridPadding);

  // Render a little circle for each color present in the poster
  renderPosterColors(
    svg,
    Array.from(colorPicker.getStore()),
    colors.background,
    width,
    height,
    gridPadding
  );

  // Optimise the SVG element using SVGO and return it's outer HTML <svg>...</svg>
  return getOptimisedSVGString(svg);
}

module.exports = { generatePoster };
