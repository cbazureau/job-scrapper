const Nick = require('nickjs');
const nick = new Nick();

// Connectors
const indeed = require('./connectors/indeed');
const remixjobs = require('./connectors/remixjobs');

const connectors = [
  indeed,
  remixjobs
];

// Jobs search results
const jobs = {};
const addJobs = (newJobs) => newJobs.forEach(job => {
  const key = `${job.site}-${job.id}`;
  if (!jobs[key]) jobs[key] = job;
});

async function connectorRun(connector, page) {
  const tab = await nick.newTab();
  await tab.open(connector.getUrl('Javascript', 'Lyon', { lat: 45.764043, lng: 4.835658999999964, dist: 50 }, page));
  await tab.untilVisible(connector.waitFor, 10000); // Verify page loading
  await tab.inject('./injects/jquery-3.2.1.min.js'); // Add Jquery
  await tab.inject('./injects/moment-2.18.1.min.js'); // Add Jquery
  const newJobs = await tab.evaluate(connector.callback);
  return newJobs;
}

(async () => {
  const promises = [];
  // Loop through connector array
  connectors.forEach(connector => {
    // Loop through 2 pages
    for (let i = 1; i <= 2; i += 1) {
      promises.push(connectorRun(connector, i));
    }
  });

  const jobsByConnector = await Promise.all(promises);
  jobsByConnector.forEach(newJobs => addJobs(newJobs));

  // TODO : save in a file or database
  // console.log(JSON.stringify(jobs, null, 2));

  Object.keys(jobs).forEach(key => console.log(`${jobs[key].date} - ${jobs[key].site} - ${jobs[key].title} - ${jobs[key].location}`));
  console.log('Nb jobs found', Object.keys(jobs).length);
})()
  .then(() => {
    console.log('Job done!');
    nick.exit();
  })
  .catch((err) => {
    console.log(`Something went wrong: ${err}`);
    nick.exit(1);
  });
