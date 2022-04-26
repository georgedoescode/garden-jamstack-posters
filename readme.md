<img src="https://garden.georgefrancis.dev/og-image.png" alt="">

# Garden — Generative Jamstack Posters

"Garden" is an experiment in building creative, joyful online experiences using core web technologies.


## 🧱 Building blocks 

- [Eleventy:](https://www.11ty.dev/) a static site generator that generates the site itself and the generative `.svg` poster files.
- [Netlify:](https://www.netlify.com/) hosts the "Garden" website and runs the build process for each deployment.
- [Puppeteer:](https://developers.google.com/web/tools/puppeteer) a Node library that can control Headless Chrome — used to create open graph images by capturing screenshots of poster pages at build time.
- [esbuild:](https://esbuild.github.io/) an extremely fast bundler that concatenates and minifies the project's CSS.
- [CUBE CSS:](https://cube.fyi/) a CSS methodology orientated towards simplicity, pragmatism and consistency — used to guide the project's CSS structure.
- [SVG.js:](https://svgjs.dev/docs/3.0/) a lightweight JS library that enables terse SVG scripting — used to help generate the poster designs.


## ⚡️ Local installation

Want to explore and run this project on your own machine? Here's how!


### Getting started

First, clone the repository:

`git clone git@github.com:georgedoescode/garden-jamstack-posters.git`

Then, navigate inside the repository and install the project's dependencies:

`cd garden-jamstack-posters && npm install`


### Development mode

To spin up a local development environment, run: `npm run watch`

This will start Eleventy in watch mode and spin up a local web server at `http://localhost:8081`.

_**Note:** to speed up local builds by only generating recent posters you can set a `POSTER_COUNT` environment variable like so:_

`POSTER_COUNT=8 npm run watch`


### Production mode

To create a production build of the site, run:

`npm run build`

This will build the site to `dist/` (just like development mode) and spin up a Puppeteer instance to generate the open graph images for each poster.


## 💡 Got an idea? Notice an issue?

I'd love to hear from you! You can always log an issue on this repo's [Github issues page](https://github.com/georgedoescode/garden-jamstack-posters/issues) or [send me a message on Twitter](https://twitter.com/georgedoescode).
