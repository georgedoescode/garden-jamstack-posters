function renderPosterText(svg, seed, color, height, padding) {
  svg
    .text(`“Garden” — ${seed.split('-').join('/')}`)
    .font({
      size: 24,
      family: 'DM Sans',
      weight: 700,
      leading: 1,
      fill: color,
    })
    .x(padding)
    .y(height - padding - 29);
}

module.exports = renderPosterText;
