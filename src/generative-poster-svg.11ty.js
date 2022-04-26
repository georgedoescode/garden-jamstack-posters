const { generatePoster } = require('./js/generate-poster');

class PosterSVG {
  data() {
    return {
      pagination: {
        data: 'posters',
        size: 1,
        alias: 'poster',
      },
      permalink: (data) =>
        `generations/${data.poster.seed}/poster-${data.poster.theme}.svg`,
    };
  }

  render(data) {
    return generatePoster(
      data.poster.seed,
      data.tokens.colors,
      data.poster.theme
    );
  }
}

module.exports = PosterSVG;
