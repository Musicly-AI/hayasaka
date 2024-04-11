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
    // 网络代理，如不需要可删除
    httpAgent,
    httpsAgent,
  });
  const metadata = await mm.parseStream(response.data);
  return Math.ceil(metadata.format.duration);
}

const httpAgent = new HttpProxyAgent("http://127.0.0.1:10808");
const httpsAgent = new HttpsProxyAgent("http://127.0.0.1:10808");

export default async function getSongData(id) {
  const songUrl = `https://app.suno.ai/song/${id}/`;

  const { data } = await axios.get(songUrl, {
  // 网络代理，如不需要可删除
    httpAgent,
    httpsAgent,
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