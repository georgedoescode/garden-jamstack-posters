function getTomorrowsDate() {
  const todaysDate = new Date();
  const tomorrowsDate = new Date(todaysDate);
  tomorrowsDate.setDate(tomorrowsDate.getDate() + 1);

  return new Intl.DateTimeFormat('en-GB', {
    day: '2-digit',
    month: '2-digit',
    year: '2-digit',
  }).format(tomorrowsDate);
}

module.exports = {
  title: 'Garden | Generative Poster Design',
  url: process.env.URL,
  tomorrowsDateText: getTomorrowsDate(),
};
