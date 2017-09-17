/* global $, moment */
module.exports = {
  getUrl: (query, location, page) => `https://remixjobs.com/Emploi-${query}-CDI?geoloc_addr=${location}&geoloc_lat=45.764043&geoloc_lng=4.835658999999964&geoloc_dist=50`,
  waitFor: '.result-count',
  callback: (arg, callback) => {
    // Here we're in the page context. It's like being in your browser's inspector tool
    const data = [];
    $('.job-list-item').each((index, element) => {
      const link = $(element).find('.title a:eq(0)').attr('href');
      const date = $(element).find('.date').text().replace(/[\n\r]/g, '');
      const tabLink = link.split('/');
      if (link) {
        const formatedDate = moment().subtract(parseInt(date.replace(/il y a (\w+) jour(s)/, '$1'), 10), 'days').format('YYYY-MM-DD');
        data.push({
          id: tabLink[tabLink.length - 1],
          link: $(element).find('.title a:eq(0)').attr('href'),
          site: 'remixjobs',
          title: $(element).find('.title a:eq(0)').text().replace(/[\n\r]/g, ''),
          company: $(element).find('.title a:eq(1)').text().replace(/[\n\r]/g, ''),
          location: $(element).find('.city').text().replace(/[\n\r]/g, ''),
          salary: $(element).find('.paycheck').text(),
          description: $(element).find('.description').text().replace(/[\n\r]/g, ''),
          date: formatedDate
        });
      }
    });
    callback(null, data);
  }
};
