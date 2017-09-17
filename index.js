const Nick = require('nickjs');
const nick = new Nick();

// Connectors
const indeed = require('./connectors/indeed');
const remixjobs = require('./connectors/remixjobs');

const jobs = {};
const addJobs = (newJobs) => newJobs.forEach(job => {
  const key = `${job.site}-${job.id}`;
  if (!jobs[key]) jobs[key] = job;
});

async function connectorRun(connector, i) {
  const tab = await nick.newTab();
  await tab.open(connector.getUrl('Javascript', 'Lyon', i));
  await tab.untilVisible(connector.waitFor); // Verify page loading
  await tab.inject('./injects/jquery-3.2.1.min.js'); // Add Jquery
  await tab.inject('./injects/moment-2.18.1.min.js'); // Add Jquery
  const newJobs = await tab.evaluate(connector.callback);
  return newJobs;
}

(async () => {
  // TODO : Loop through connector array
  // Loop through 3 pages
  for (let i = 1; i <= 3; i += 1) {
    const newJobs = await connectorRun(indeed, i);
    addJobs(newJobs);
  }

  const newJobs = await connectorRun(remixjobs, 1);
  addJobs(newJobs);

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
