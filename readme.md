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
