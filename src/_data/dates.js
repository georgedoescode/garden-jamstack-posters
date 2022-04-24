const now = new Intl.DateTimeFormat(new Date()).formatToParts();

const START_DATE = [2022, 2, 21, 0, 0];
const CURRENT_DATE = [
  parseInt(now.find((v) => v.type === 'year').value),
  parseInt(now.find((v) => v.type === 'month').value - 1),
  parseInt(now.find((v) => v.type === 'day').value),
  0,
  0,
];

function getDatesBetweenDates(startDate, endDate) {
  let dates = [];

  const theDate = new Date(startDate);

  while (theDate < endDate) {
    dates = [...dates, new Date(theDate)];
    theDate.setDate(theDate.getDate() + 1);
  }

  dates = [...dates, endDate];

  return dates.reverse().map((d) =>
    // DD-MM-YY
    new Intl.DateTimeFormat('en-GB', {
      day: '2-digit',
      month: '2-digit',
      year: '2-digit',
    })
      .format(d)
      // Remove slashes from dates as they cause issues when used as file paths
      .split('/')
      .join('-')
  );
}

module.exports = function () {
  return getDatesBetweenDates(
    new Date(...START_DATE),
    new Date(...CURRENT_DATE)
  );
};
