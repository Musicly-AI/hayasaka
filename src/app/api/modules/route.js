import { NextResponse } from "next/server";
import dbConnect from "@/utils/dbconnect";

import SongPlaylist from "@/models/songplaylist";
import Song from "@/models/song";
import Album from "@/models/album";
import Artist from "@/models/artist";
import Lyrics from "@/models/lyrics";
import Charts from "@/models/charts";

// Get user info
export async function GET(req) {
  console.log("req", req.nextUrl.searchParams);
  const searchParams = req.nextUrl.searchParams;
  const queryLang = searchParams.get("language");

  try {
    await dbConnect();

    const resData = {
      albums: [],
      songs: [],
      charts: [],
      playlists: [],
      trending: {
        albums: [],
        songs: [],
      },
    };

    // // 查询首页专辑，New Releases 列表
    // const albums = await Album.find({ isModule: true, language: queryLang})
    //   .populate("artists.primary", "id name role type url image")
    //   .populate("artists.featured", "id name role type url image")
    //   .populate("artists.all", "id name role type url image")
    //   .populate({
    //     path: "songs",
    //     populate: [
    //       { path: "lyrics" },
    //       { path: "album", select: "id name url" },
    //       { path: "artists.primary", select: "id name role type url image" },
    //       { path: "artists.featured", select: "id name role type url image" },
    //       { path: "artists.all", select: "id name role type url image" },
    //     ],
    //   })
    //   // 根据 moduleSortNo 排序
    //   .sort({ moduleSortNo: 1 })
    //   .exec();

    // if (albums.length > 0) {
    //   resData.albums = albums.map((album) => {
    //     const item = album.toObject();
    //     item.primaryArtists = item.artists.primary;
    //     item.featuredArtists = item.artists.featured;
    //     item.artists = item.artists.all;
    //     return item;
    //   });
    // }

    // search last created 20 songs
    const songs = await Song.find({ language: queryLang })
      .populate("lyrics")
      .populate("album", "id name url")
      .populate("artists.primary", "id name role type url image")
      .populate("artists.featured", "id name role type url image")
      .populate("artists.all", "id name role type url image")
      .sort({ createdAt: -1 })
      .limit(20)
      .exec();

      if (songs.length > 0) {
        resData.songs = songs.map((song) => {
          const item = song.toObject();
          item.primaryArtists = item.artists.primary;
          item.featuredArtists = item.artists.featured;
          item.artists = item.artists.all;
          return item;
        });
      }

    // 查询首页 charts , Charts 列表
    const charts = await SongPlaylist.find({ isChart: true })
      .sort({ chartSortNo: 1 })
      .exec();
    if (charts.length > 0) {
      resData.charts = charts.map((chart) => {
        const chartData = chart.toObject();
        const item = {
          id: chartData._id,
          title: chartData.name,
          subtitle: chartData.description,
          type: 'playlist',
          image: chartData.image,
          url: chartData.url,
          firstname: chartData.name,
          explicitContent: chartData.explicitContent ? "1" : "0",
          language: chartData.language,
        };
        return item;
      });
    }

    // 查询首页播放列表
    const playlists = await SongPlaylist.find({ isModule: true })
      .sort({ moduleSortNo: 1 })
      .exec();

    if (playlists.length > 0) {
      resData.playlists = playlists.map((playlist) => {
        const item = playlist.toObject();
        item.title = item.name;
        item.subtitle = item.description;
        item.lastUpdated = item.updatedAt;
        return item;
      });
    }

    // 查询  trending 的歌曲
    const trending = await Song.find({ isTrending: true, language: queryLang })
      .populate("lyrics")
      .populate("album", "id name url")
      .populate("artists.primary", "id name role type url image")
      .populate("artists.featured", "id name role type url image")
      .populate("artists.all", "id name role type url image")
      .sort({ trendingSortNo: 1 })
      .exec();

    if (trending.length > 0) {
      resData.trending.songs = trending.map((song) => {
        const item = song.toObject();
        item.primaryArtists = item.artists.primary;
        item.featuredArtists = item.artists.featured;
        item.artists = item.artists.all;
        return item;
      });
    }

    // 查询 trending 的专辑
    const trendingAlbums = await Album.find({ isTrending: true, language: queryLang })
      .populate("artists.primary", "id name role type url image")
      .populate("artists.featured", "id name role type url image")
      .populate("artists.all", "id name role type url image")
      .sort({ trendingSortNo: 1 })
      .exec();

    if (trendingAlbums.length > 0) {
      resData.trending.albums = trendingAlbums.map((album) => {
        const item = album.toObject();
        item.primaryArtists = item.artists.primary;
        item.featuredArtists = item.artists.featured;
        item.artists = item.artists.all;
        return item;
      });
    }

    return NextResponse.json({
      success: true,
      essage: "Modules data",
      data: resData,
    });
  } catch (e) {
    console.error(e);
    return NextResponse.json(
      {
        success: false,
        message: "Something went wrong",
        data: null,
      },
      { status: 500 }
    );
  }
}
