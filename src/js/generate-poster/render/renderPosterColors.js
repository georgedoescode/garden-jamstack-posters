function renderPosterColors(
  svg,
  allColorsPresentInPoster,
  background,
  width,
  height,
  padding
) {
  for (let i = 0; i < allColorsPresentInPoster.length; i++) {
    svg
      .circle(24)
      .x(width - padding - 24)
      .y(height - padding - 24)
      .stroke({
        width: 2,
        color: background,
      })
      .fill(allColorsPresentInPoster[i])
      .translate(-i * 16, 0);
  }
}

module.exports = renderPosterColors;
