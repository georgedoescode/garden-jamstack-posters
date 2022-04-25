function roundToDecimal(value, step) {
  step || (step = 1.0);

  const inv = 1.0 / step;

  return Math.round(value * inv) / inv;
}

module.exports = roundToDecimal;
