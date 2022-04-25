# Garden — Generative Jamstack Posters

## Notes

### Accessibility

- I uncovered an accessibility issue with screen readers and the <br /> element included in the site element. Have refactored to use 2 headings.
- I uncovered an accessibility issue in that screen readers were announcing all SVG images on the page so I rolled my own eleventy plugin that allows me to set attributes on the inlined svg elements.
- I am using clamp for fluid typography, there are some accessibility considerations here, potentially around zooming.

### DX

- A prettier config is included to keep code style consistent. Prettier is not currently active on .njk files, however.
- Syntax highlighting/linting is disabled in my theme.njk file. This could lead to DX issues and mistakes when editing.
- As more days go by, builds will become longer. Could we work around this using on demand builders?
- Created by own SVG shortcode to allow more flexible accessibility options and optimisation using SVGO.
- I'm not using any autoprefixing, etc, on my CSS as this project is and experiment aimed at dev folk. If I were to expand it, I would potentially introduce PostCSS or equivalent! For now it is only using esbuild for file concatenation and minification as it is speedy and simple.
- I'm not 100% sure about using two different templating languages in the same project, but as of right now the DX of using addNunjucksGlobal for generative templates isn't great (it requires an entire eleventy restart to reflect changes)

### CSS

- Uses a simple CUBE methodology
- Has no device resolution media queries!
