const dates = require('./dates')();

module.exports = function () {
  const postersLight = dates.map((date) => ({ seed: date, theme: 'light' }));
  const postersDark = dates.map((date) => ({ seed: date, theme: 'dark' }));

  return [...postersLight, ...postersDark];
};
