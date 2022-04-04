const { generatePoster } = require('./js/generate-poster');

class PosterSVG {
  data() {
    return {
      pagination: {
        data: 'posters',
        size: 1,
        alias: 'poster',
      },
      permalink: (data) => `generations/${data.poster.seed}/poster.svg`,
    };
  }

  render(data) {
    return generatePoster(data.poster.seed);
  }
}

module.exports = PosterSVG;
