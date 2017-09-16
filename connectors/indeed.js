/* global $ */
module.exports = {
  getUrl: (query, location, page) => `https://www.indeed.fr/emplois?q=${query}&l=${location}&start=${(10 * (page - 1))}`,
  link: (id) => `https://www.indeed.fr/viewjob?jk=${id}`,
  waitFor: '#resultsCol',
  callback: (arg, callback) => {
    // Here we're in the page context. It's like being in your browser's inspector tool
    const data = [];
    $('.result').each((index, element) => {
      const id = $(element).find('h2').attr('id');
      const isSponsored = $(element).find('.sponsoredGray').text();
      if (id && !isSponsored) {
        data.push({
          id: id.replace('jl_', ''),
          site: 'indeed',
          title: $(element).find('.jobtitle').text().replace(/[\n\r]/g, ''),
          company: $(element).find('.company').text().replace(/[\n\r]/g, ''),
          location: $(element).find('.location').text().replace(/[\n\r]/g, ''),
          salary: $(element).find('.no-wrap').text(),
          description: $(element).find('.summary').text().replace(/[\n\r]/g, ''),
          date: $(element).find('.date').text().replace(/[\n\r]/g, '')
        });
      }
    });
    callback(null, data);
  }
};
