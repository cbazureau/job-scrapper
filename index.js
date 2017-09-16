const Nick = require('nickjs');
const nick = new Nick();

// Connectors
const indeed = require('./connectors/indeed');

(async () => {
  const tab = await nick.newTab();
  // TODO : Loop through connector array
  await tab.open(indeed.url);
  await tab.untilVisible(indeed.waitFor); // Verify page loading
  await tab.inject('./injects/jquery-3.2.1.min.js'); // Add Jquery
  const jobs = await tab.evaluate(indeed.callback);

  // TODO : save in a file or database
  console.log(JSON.stringify(jobs, null, 2));
})()
  .then(() => {
    console.log('Job done!');
    nick.exit();
  })
  .catch((err) => {
    console.log(`Something went wrong: ${err}`);
    nick.exit(1);
  });
