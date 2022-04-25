const { random } = require('@georgedoescode/generative-utils');

function createColorPicker(colors) {
  const colorStore = new Set();

  return {
    random() {
      const color = random(colors);

      colorStore.add(color);

      return color;
    },
    getStore() {
      return colorStore;
    },
  };
}

module.exports = createColorPicker;
