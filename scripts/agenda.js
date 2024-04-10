const Agenda = require('@hokify/agenda').Agenda;
const getDailyTrendingData = require('./jobs/getDailyTrendingData');

const mongoConnectionString = process.env.AGENDA_MONGODB_URL;
if (!mongoConnectionString) {
  console.error('AGENDA_MONGODB_URL environment variable is not defined');
  process.exit(1);
}

const agenda = new Agenda({db: {address: mongoConnectionString}});

// agenda.define('example', (job, done) => {
//   console.log(new Date(), 'Example job');
//   done();
// });

// Obtain the trending list daily at midnight.
agenda.define('getDailyTrendingData', async (job) => {
  console.log(new Date(), 'Get daily trending data');
  await getDailyTrendingData();
});


agenda.on('ready', async () => {
  // Obtain the trending list daily at midnight.
  await agenda.every('0 0 * * *', 'getDailyTrendingData');
  // await agenda.every('60 seconds', 'getDailyTrendingData'); // test

  await agenda.start();
});