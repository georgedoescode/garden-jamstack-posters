const chromium = require('chrome-aws-lambda');
const fs = require('fs');
const path = require('path');

function getDirectories(srcPath) {
  return fs
    .readdirSync(path.resolve(__dirname, srcPath))
    .filter((file) =>
      fs
        .statSync(path.join(path.resolve(__dirname, srcPath), file))
        .isDirectory()
    );
}

(async () => {
  const basePageDir = '../dist/generations';
  const allPages = getDirectories(basePageDir).map((seed) => {
    return {
      seed,
      path: path.resolve(__dirname, `${basePageDir}/${seed}/index.html`),
    };
  });

  const browser = await chromium.puppeteer.launch({
    args: chromium.args,
    executablePath: await chromium.executablePath,
    headless: chromium.headless,
  });

  const page = await browser.newPage();

  const dir = path.resolve(__dirname, '../dist/og-images');
  if (!fs.existsSync(dir)) fs.mkdirSync(dir);

  await page.setViewport({
    width: 640,
    height: 360,
    deviceScaleFactor: 4,
  });

  for (let i = 0; i < allPages.length; i++) {
    const entry = allPages[i];

    await page.goto('file://' + entry.path);

    const siteThemeCSS = fs
      .readFileSync(path.resolve(__dirname, '../dist/css/theme.css'))
      .toString();

    const siteMainCSS = fs
      .readFileSync(path.resolve(__dirname, '../dist/css/main.css'))
      .toString();

    await page.addStyleTag({
      content: `
          ${siteThemeCSS}
          ${siteMainCSS}

          a {
            display: none;
          }

          .background-splodges {
            display: none;
          }

          .poster-page {
            --shadow-color: hsla(0, 100%, 100%, 0.1);
          }

          .poster-page body {
            color: #fff;
            height: 100vh;
            background: #091510;
          }

          .spinning-flower {
            animation-play-state: paused;
          }
        `,
    });

    await page.screenshot({
      path: `${dir}/${entry.seed}.png`,
      type: 'png',
      clip: { x: 0, y: 0, width: 640, height: 360 },
    });
  }

  await browser.close();
})();
