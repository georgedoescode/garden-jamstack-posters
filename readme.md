<img src="https://garden.georgefrancis.dev/og-image.png" alt="">

# Garden — Generative Jamstack Posters

"Garden" is an experiment in building creative, joyful online experiences using core web technologies.

## Building blocks

- [Eleventy:](https://www.11ty.dev/) a static site generator that generates the site's `.html` and generative `.svg` poster files.
- [Netlify:](https://www.netlify.com/) hosts the "Garden" website and runs the build process for each deployment.
- [Puppeteer:](https://developers.google.com/web/tools/puppeteer) a Node library that can control Headless Chrome — used to create open graph images by screenshotting poster pages at build time.
- [esbuild:](https://esbuild.github.io/) an extremely fast bundler that concatenates and minifies the project's CSS.
- [CUBE CSS:](https://cube.fyi/) a CSS methodology orientated towards simplicity, pragmatism and consistency — used to guide the project's CSS structure.
- [SVG.js:](https://svgjs.dev/docs/3.0/) a lightweight JS library that enables terse SVG scripting — used to help generate the poster designs.

## Local installation

Want to explore and run this project on your own machine? Here's how!

### Getting started

First, clone the repository:

`git clone git@github.com:georgedoescode/garden-jamstack-posters.git`

Then, navigate inside the repository and install the project's dependencies:

`cd garden-jamstack-posters`

`npm install`

### Development mode

To spin up a local development environment, run the following command:

`npm run watch`

The above will start Eleventy in watch mode and spin up a local web server at `http://localhost:8081`. Navigate there in your browser of choice, and you should see the "Garden" site!

**Note:** to speed up local builds, you can set a `POSTER_COUNT` environment variable before running the local development command:

`POSTER_COUNT=8 npm run watch`

### Running a "production" build

To create a production-style build of the site, use the following command:

`npm run build`

The above command will build the site to `dist/` (just like development mode) and spin up a Puppeteer instance to generate the open graph images for each poster.

## Got an idea? Notice an issue?

I'd love to hear from you! You can always log an issue on this repo's [Github issues page](https://github.com/georgedoescode/garden-jamstack-posters/issues) or [send me a message on Twitter](https://twitter.com/georgedoescode).
