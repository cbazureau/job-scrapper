/* global $, moment */
module.exports = {
  getUrl: (query, location, geo, page) => `https://www.indeed.fr/emplois?q=${query}&l=${location}&start=${(10 * (page - 1))}&sort=date`,
  waitFor: '#resultsCol',
  callback: (arg, callback) => {
    // Here we're in the page context
    const data = [];
    $('.result').each((index, element) => {
      const id = $(element).find('h2').attr('id');
      const isSponsored = $(element).find('.sponsoredGray').text();
      const date = $(element).find('.date').text().replace(/[\n\r]/g, '');
      if (id && !isSponsored && date !== 'il y a 30+ jours') {
        const formatedDate = moment().subtract(parseInt(date.replace(/il y a (\w+) jour(s)/, '$1'), 10), 'days').format('YYYY-MM-DD');
        data.push({
          id: id.replace('jl_', ''),
          link: `https://www.indeed.fr/viewjob?jk=${id.replace('jl_', '')}`,
          site: 'indeed',
          title: $(element).find('.jobtitle').text().replace(/[\n\r]/g, ''),
          company: $(element).find('.company').text().replace(/[\n\r]/g, ''),
          location: $(element).find('.location').text().replace(/[\n\r]/g, ''),
          salary: $(element).find('.no-wrap').text(),
          description: $(element).find('.summary').text().replace(/[\n\r]/g, ''),
          date: formatedDate
        });
      }
    });
    callback(null, data);
  }
};
