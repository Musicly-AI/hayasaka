const fs = require("fs");
const mongoose = require("mongoose");
const axios = require("axios");
const cheerio = require("cheerio");
const moment = require("moment-timezone");

const HttpProxyAgent = require("http-proxy-agent").HttpProxyAgent;
const HttpsProxyAgent = require("https-proxy-agent").HttpsProxyAgent;
const mm = require("music-metadata");

async function getDuration(url) {
  const response = await axios.get(url, {
    responseType: "stream",
    // httpAgent,
    // httpsAgent,
  });
  const metadata = await mm.parseStream(response.data);
  return Math.ceil(metadata.format.duration);
}

// 网络代理，如不需要可删除
const httpAgent = new HttpProxyAgent("http://127.0.0.1:10808");
const httpsAgent = new HttpsProxyAgent("http://127.0.0.1:10808");

async function getSongData(id) {
  const songUrl = `https://app.suno.ai/song/${id}/`;

  const { data } = await axios.get(songUrl, {
    // httpAgent,
    // httpsAgent,
  });
  const $ = cheerio.load(data);

  // 解析页面元素
  const name = $("h2.css-1dklj6k").first().text().trim();
  const type = "song";
  const description = $("p.css-0").first().text().trim();
  const dateStr = $("p.css-ln1ikl").first().text().trim();
  // 不同语言环境下，日期格式可能不同，需要根据实际情况调整
  console.log("date", dateStr);
  const releaseDate = moment
    .tz(dateStr, "MMMM D, YYYY", "America/New_York")
    .toDate();
  const year = releaseDate.getFullYear();
  const label = $("span.css-1eveppl").first().text().trim();
  const language = "english";
  const hasLyrics = true;
  const isTrending = false;
  const url = `https://cdn1.suno.ai/${id}.mp3`;
  const duration = await getDuration(url);
  const praiseCount = $("p.css-1ceo1nj").first().text().trim();
  const image = [
    {
      quality: "200x200",
      url: $("div.css-cl5oj8 img").attr("src"),
    },
  ];
  const downloadUrl = [
    {
      quality: "high",
      url: url,
    },
  ];

  // 歌词
  const lyrics = {
    copyright: "",
    snippet: "",
    lyrics: $("p.css-w5d21i").first().text().trim(),
  };

  const trendingSortNo = 10;

  const songData = {
    name,
    description,
    type,
    year,
    releaseDate,
    label,
    duration,
    language,
    hasLyrics,
    isTrending,
    url,
    image,
    downloadUrl,
    lyrics,
    praiseCount,
    trendingSortNo,
  };

  return songData;
}

async function fetchWebData() {
  // 连接MongoDB数据库
  // await mongoose.connect("mongodb://0.0.0.0:27017/haya", {
  //   useNewUrlParser: true,
  //   useUnifiedTopology: true,
  // });
  await mongoose.connect("mongodb+srv://haya:pvWVG6O0k2BkwrM0@cluster0.kjph7ms.mongodb.net/haya?retryWrites=true&w=majority&appName=Cluster0", {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  });

  console.log("成功连接到MongoDB数据库");

  // 读取待获取文件
  const songsJsonData = fs.readFileSync("./scripts/data/songsUrl.json");
  const urlArray = JSON.parse(songsJsonData);

  if (urlArray.length > 0) {
    for (let i = 0; i < urlArray.length; i++) {
      const id = urlArray[i];
      const songData = await getSongData(id);
      console.log(songData);

      const Lyrics = require("./models/lyrics");
      const Song = require("./models/song");

      const lyrics = songData.lyrics;
      const lyricsData = await Lyrics.create(lyrics);
      songData.lyricsId = lyricsData._id;
      songData.lyrics = lyricsData;

      await Song.create(songData);

      console.log(`成功插入歌曲数据 ${songData.name},id: ${id}`);
    }
  }

  console.log("数据获取完毕");
}

fetchWebData();
