const getDailyTrendingData = require("./jobs/getDailyTrendingData");

async function testJob() {
  await getDailyTrendingData();

}

testJob();