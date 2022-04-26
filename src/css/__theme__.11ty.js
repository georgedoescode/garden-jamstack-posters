const {
  buildFluidDesignSystem,
} = require('../js/utils/buildFluidDesignSystem');

/* 
  Note: Potential DX issue - Some congnitive overhead could be introduced by 
  mixing .11ty.js and .css files together in one directory
*/

class CSSTheme {
  data() {
    return {
      permalink: `/css/theme.css`,
    };
  }

  render(data) {
    const fluidDesignSystem = buildFluidDesignSystem({
      minViewport: data.tokens.typography.minViewport,
      maxViewport: data.tokens.typography.maxViewport,
      typeScaleSteps: [-2, -1, 0, 1, 2, 3, 4, 5],
      spaceSteps: {
        '-3XS': 0.25,
        '-2XS': 0.5,
        '-XS': 0.75,
        '-S': 1,
        '-M': 1.5,
        '-L': 2,
        '-XL': 3,
        '-2XL': 4,
        '-3XL': 6,
        '-4XL': 8,
      },
      spacePairs: {
        '-3XS': '-2XS',
        '-2XS': '-XS',
        '-XS': '-S',
        '-S': '-M',
        '-M': '-L',
        '-L': '-XL',
        '-XL': '-2XL',
        '-2XL': '-3XL',
      },
      customPairs: {
        '-S': '-L',
      },
    });

    // Note: Potential DX issue - CSS syntax highlighting/linting is disabled here!
    return `
      :where(html) {
        ${fluidDesignSystem.generateCSS()}

        --green-dark: ${data.tokens.colors.greenDark};
        --green-base: ${data.tokens.colors.greenBase};
        --green-light: ${data.tokens.colors.greenLight};
        --red-base: ${data.tokens.colors.redBase};
        --yellow-base: ${data.tokens.colors.yellowBase};
        --pink-base: ${data.tokens.colors.pinkBase};
        --blue-base: ${data.tokens.colors.blueBase};
    
        --border-radius: 0.75rem;
      
        --leading-flat: 1;
        --leading-tight: 1.2;
        --leading-normal: 1.618;
      }
    `;
  }
}

module.exports = CSSTheme;
