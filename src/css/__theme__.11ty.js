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
    // Note: Potential DX issue - CSS syntax highlighting/linting is disabled here!
    return `
      :where(html) {
        --green-dark: ${data.tokens.colors.greenDark};
        --green-base: ${data.tokens.colors.greenBase};
        --green-light: ${data.tokens.colors.greenLight};
        --red-base: ${data.tokens.colors.redBase};
        --yellow-base: ${data.tokens.colors.yellowBase};
        --pink-base: ${data.tokens.colors.pinkBase};
      
        --step--2: clamp(0.8rem, calc(0.67rem + 0.11vw), 0.69rem);
        --step--1: clamp(1rem, calc(0.8rem + 0.17vw), 0.83rem);
        --step-0: clamp(1rem, calc(0.95rem + 0.25vw), 1.25rem);
        --step-1: clamp(1.2rem, calc(1.13rem + 0.36vw), 1.56rem);
        --step-2: clamp(1.44rem, calc(1.34rem + 0.51vw), 1.95rem);
        --step-3: clamp(1.73rem, calc(1.59rem + 0.71vw), 2.44rem);
        --step-4: clamp(2.07rem, calc(1.88rem + 0.98vw), 3.05rem);
        --step-5: clamp(2.49rem, calc(2.22rem + 1.33vw), 3.82rem);
      
        --space-3xs: clamp(0.25rem, calc(0.24rem + 0.06vw), 0.31rem);
        --space-2xs: clamp(0.5rem, calc(0.48rem + 0.13vw), 0.63rem);
        --space-xs: clamp(0.75rem, calc(0.71rem + 0.19vw), 0.94rem);
        --space-s: clamp(1rem, calc(0.95rem + 0.25vw), 1.25rem);
        --space-m: clamp(1.5rem, calc(1.43rem + 0.38vw), 1.88rem);
        --space-l: clamp(2rem, calc(1.9rem + 0.5vw), 2.5rem);
        --space-xl: clamp(3rem, calc(2.85rem + 0.75vw), 3.75rem);
        --space-2xl: clamp(4rem, calc(3.8rem + 1vw), 5rem);
        --space-3xl: clamp(6rem, calc(5.7rem + 1.5vw), 7.5rem);
      
        --space-3xs-2xs: clamp(0.25rem, calc(0.18rem + 0.38vw), 0.63rem);
        --space-2xs-xs: clamp(0.5rem, calc(0.41rem + 0.44vw), 0.94rem);
        --space-xs-s: clamp(0.75rem, calc(0.65rem + 0.5vw), 1.25rem);
        --space-s-m: clamp(1rem, calc(0.83rem + 0.88vw), 1.88rem);
        --space-m-l: clamp(1.5rem, calc(1.3rem + 1vw), 2.5rem);
        --space-l-xl: clamp(2rem, calc(1.65rem + 1.75vw), 3.75rem);
        --space-xl-2xl: clamp(3rem, calc(2.6rem + 2vw), 5rem);
        --space-2xl-3xl: clamp(4rem, calc(3.3rem + 3.5vw), 7.5rem);
      
        --space-s-l: clamp(1rem, calc(0.7rem + 1.5vw), 2.5rem);
      
        --border-radius: 0.75rem;
      
        --leading-flat: 1;
        --leading-tight: 1.2;
        --leading-normal: 1.618;
      }
    `;
  }
}

module.exports = CSSTheme;