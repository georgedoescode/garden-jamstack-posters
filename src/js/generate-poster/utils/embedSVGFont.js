function embedSVGFont(encodedFont, svg) {
  svg.node.innerHTML += `
    <defs>
        <style>
          ${encodedFont}
        </style>
    </defs>
  `;

  svg.node.style.setProperty('-webkit-font-smoothing', 'antialiased');
  svg.node.style.setProperty('-moz-osx-font-smoothing', 'grayscale');
}

module.exports = embedSVGFont;
