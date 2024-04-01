const fs = require("fs");
const mongoose = require("mongoose");


async function initData() {
  // 连接MongoDB数据库
  await mongoose.connect("mongodb://localhost:27017/haya", {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  });

  console.log("成功连接到MongoDB数据库");

  // const Lyrics = require("./models/lyrics");

  // // 新增歌词数据

  // // 读取JSON文件
  // const lyricsJsonData = fs.readFileSync("./scripts/data/lyrics.json");

  // // 解析JSON数据
  // const lyricsArray = JSON.parse(lyricsJsonData);

  // // 插入数据到数据库
  // Lyrics.insertMany(lyricsArray).then(function (err, docs) {
  //   if (err) {
  //     console.error(err);
  //   } else {
  //     console.log("成功插入数据到数据库");
  //   }
  // });

  // // 新增专辑数据
  // const Album = require("./models/album");

  // // 读取JSON文件
  // const albumJsonData = fs.readFileSync("./scripts/data/album.json");

  // // 解析JSON数据
  // const albumArray = JSON.parse(albumJsonData);

  // // 插入数据到数据库
  // Album.insertMany(albumArray).then(function (err, docs) {
  //   if (err) {
  //     console.error(err);
  //   } else {
  //     console.log("成功插入数据到数据库");
  //   }
  // });


  // // 新增艺术家数据
  // const Artist = require("./models/artist");
  // // 读取JSON文件
  // const artistJsonData = fs.readFileSync("./scripts/data/artists.json");

  // // 解析JSON数据
  // const artistArray = JSON.parse(artistJsonData);

  // // 插入数据到数据库
  // Artist.insertMany(artistArray).then(function (err, docs) {
  //   if (err) {
  //     console.error(err);
  //   } else {
  //     console.log("成功插入数据到数据库");
  //   }
  // });



  // // 新增播放列表数据
  // const SongPlaylist = require("./models/songplaylist");
  // // 读取JSON文件
  // const songPlaylistJsonData = fs.readFileSync("./scripts/data/songPlaylist.json");

  // // 解析JSON数据
  // const songPlaylistArray = JSON.parse(songPlaylistJsonData);

  // // 插入数据到数据库
  // SongPlaylist.insertMany(songPlaylistArray).then(function (err, docs) {
  //   if (err) {
  //     console.error(err);
  //   } else {
  //     console.log("成功插入数据到数据库");
  //   }
  // });


  // // 新增歌曲数据
  // const Song = require("./models/song");

  // // 读取JSON文件
  // const songJsonData = fs.readFileSync("./scripts/data/songs.json");

  // // 解析JSON数据
  // const songArray = JSON.parse(songJsonData);

  // // 插入数据到数据库
  // Song.insertMany(songArray).then(function (err, docs) {
  //   if (err) {
  //     console.error(err);
  //   } else {
  //     console.log("成功插入数据到数据库");
  //   }
  // });


  // // 新增charts数据
  // const Charts = require("./models/charts");

  // // 读取JSON文件
  // const chartsJsonData = fs.readFileSync("./scripts/data/charts.json");

  // // 解析JSON数据
  // const chartsArray = JSON.parse(chartsJsonData);

  // // 插入数据到数据库
  // Charts.insertMany(chartsArray).then(function (err, docs) {
  //   if (err) {
  //     console.error(err);
  //   } else {
  //     console.log("成功插入数据到数据库");
  //   }
  // });

  // 新增 Mudeles data
  const Charts = require("./models/charts");
  const Lyrics = require("./models/lyrics");
  const Song = require("./models/song");
  const SongPlaylist = require("./models/songplaylist");
  const Artist = require("./models/artist");
  const Album = require("./models/album");

  // 读取JSON文件
  const modulesJsonData = fs.readFileSync("./scripts/data/modules.json");

  // 解析JSON数据
  const modulesData = JSON.parse(modulesJsonData);

  // 解析 albums data
  if (modulesData.albums) {
    const albumArray = modulesData.albums;
    // 遍历数据，先插入艺术家、歌曲数据，获取 _id 后再插入专辑数据
    for (let i = 0; i < albumArray.length; i++) {
      const album = albumArray[i];
      delete album.id;
      // 插入艺术家数据
      const artists = album.artists;
      const artistIds = [];
      for (let j = 0; j < artists.length; j++) {
        const artist = artists[j];
        delete artist.id;
        if (!artist.image) {
          delete artist.image;
        } else {
          //iamge 数组 中 link 赋值到 url
          artist.image.forEach(element => {
            element.url = element.link;
            delete element.link;
          });
        }
        const artistData = await Artist.create(artist);
        artistIds.push(artistData._id);
      }

      // 插入歌曲数据
      const songs = album.songs;
      const songIds = [];
      for (let j = 0; j < songs.length; j++) {
        const song = songs[j];
        delete song.id;
        if (!song.image) {
          delete song.image;
        } else {
          //iamge 数组 中 link 赋值到 url
          song.image.forEach(element => {
            element.url = element.link;
            delete element.link;
          });
        }

        const songData = await Song.create(song);
        songIds.push(songData._id);
      }

      // 插入专辑数据
      album.artists = {
        primary: [],
        featured: [],
        all: artistIds,
      };
      album.songs = songIds;
      album.isModule = true;

      // 处理图片
      if (album.image) {
        album.image.forEach(element => {
          element.url = element.link;
          delete element.link;
        });
      }
      await Album.create(album);
    }
  }

  // 插入播放列表数据
  if (modulesData.playlists) {
    const playlists = modulesData.playlists;
    for (let i = 0; i < playlists.length; i++) {
      const playlist = playlists[i];
      delete playlist.id;
      playlist.name = playlist.title;
      playlist.description = playlist.subtitle;
      playlist.isModule = true;

      // 处理图片
      if (playlist.image) {
        playlist.image.forEach(element => {
          element.url = element.link;
          delete element.link;
        });
      }
      await SongPlaylist.create(playlist);
    }
  }

  // 插入charts 数据
  if (modulesData.charts) {
    const charts = modulesData.charts;
    for (let i = 0; i < charts.length; i++) {
      const chart = charts[i];
      chart.isModule = true;
      delete chart.id;

      // 处理图片
      if (chart.image) {
        chart.image.forEach(element => {
          element.url = element.link;
          delete element.link;
        });
      }
      await Charts.create(chart);
    }
  }

  // 插入 trending 歌曲数据
  if (modulesData.trending) {
    const trending = modulesData.trending;
    const songs = trending.songs;
    for (let i = 0; i < songs.length; i++) {
      const song = songs[i];
      delete song.id;
      // 插入专辑数据
      const album = song.album;
      delete album.id;
      const albumData = await Album.create(album);
      song.album = albumData._id;
      // 插入艺术家数据
      const artists = song.primaryArtists;
      const artistIds = [];
      for (let j = 0; j < artists.length; j++) {
        const artist = artists[j];
        delete artist.id;
        if (!artist.image) {
          delete artist.image;
        } else {
          //iamge 数组 中 link 赋值到 url
          artist.image.forEach(element => {
            element.url = element.link;
            delete element.link;
          });
        }
        const artistData = await Artist.create(artist);
        artistIds.push(artistData._id);
      }
      song.artists = {
        primary: artistIds,
        featured: [],
        all: artistIds,
      };
      song.isTrending = true;

      // 处理图片
      if (song.image) {
        song.image.forEach(element => {
          element.url = element.link;
          delete element.link;
        });
      }
      await Song.create(song);
    }

    // 专辑数据
    const albums = trending.albums;
    for (let i = 0; i < albums.length; i++) {
      const album = albums[i];
      delete album.id;
      // 插入艺术家数据
      const artists = album.artists;
      const artistIds = [];
      for (let j = 0; j < artists.length; j++) {
        const artist = artists[j];
        delete artist.id;
        if (!artist.image) {
          delete artist.image;
        } else {
          //iamge 数组 中 link 赋值到 url
          artist.image.forEach(element => {
            element.url = element.link;
            delete element.link;
          });
        }
        const artistData = await Artist.create(artist);
        artistIds.push(artistData._id);
      }

      // 插入专辑数据
      album.artists = {
        primary: [],
        featured: [],
        all: artistIds,
      };
      album.isTrending = true;

      // 处理图片
      if (album.image) {
        album.image.forEach(element => {
          element.url = element.link;
          delete element.link;
        });
      }
      await Album.create(album);
    }

      console.log("成功插入数据到数据库");
  }

}

initData();
