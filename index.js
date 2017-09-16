const Nick = require('nickjs');
const nick = new Nick();

// Connectors
const indeed = require('./connectors/indeed');

async function connectorRun(connector, i) {
  const tab = await nick.newTab();
  await tab.open(connector.getUrl('Javascript', 'Lyon (69)', i));
  await tab.untilVisible(connector.waitFor); // Verify page loading
  await tab.inject('./injects/jquery-3.2.1.min.js'); // Add Jquery
  const newJobs = await tab.evaluate(connector.callback);
  return newJobs;
}

(async () => {
  const jobs = {};
  // TODO : Loop through connector array
  // Loop through 5 pages
  for (let i = 1; i < 5; i += 1) {
    const newJobs = await connectorRun(indeed, i);
    newJobs.forEach(job => {
      const key = `${job.site}-${job.id}`;
      if (!jobs[key]) jobs[key] = job;
    });
  }

  // TODO : save in a file or database
  // console.log(JSON.stringify(jobs, null, 2));
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
