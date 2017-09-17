/* global $, moment */
module.exports = {
  getUrl: (query, location, geo, page) => `https://remixjobs.com/Emploi-${query}-CDI?geoloc_addr=${location}&geoloc_lat=${geo.lat}&geoloc_lng=${geo.lng}&geoloc_dist=${geo.dist}&page=${page}`,
  waitFor: '.result',
  callback: (arg, callback) => {
    // Here we're in the page context
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
