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
      charts: [],
      playlists: [],
      trending: {
        albums: [],
        songs: [],
      },
    };

    // 查询首页专辑
    const albums = await Album.find({ isModule: true, language: queryLang})
      .populate("artists.primary", "id name role type url image")
      .populate("artists.featured", "id name role type url image")
      .populate("artists.all", "id name role type url image")
      .populate({
        path: "songs",
        populate: [
          { path: "lyrics" },
          { path: "album", select: "id name url" },
          { path: "artists.primary", select: "id name role type url image" },
          { path: "artists.featured", select: "id name role type url image" },
          { path: "artists.all", select: "id name role type url image" },
        ],
      })
      .exec();

    if (albums.length > 0) {
      resData.albums = albums.map((album) => {
        const item = album.toObject();
        item.primaryArtists = item.artists.primary;
        item.featuredArtists = item.artists.featured;
        item.artists = item.artists.all;
        return item;
      });
    }

    // 查询首页 charts
    const charts = await Charts.find({ isModule: true, language: queryLang })
      .exec();
    if (charts.length > 0) {
      resData.charts = charts.map((chart) => {
        const item = chart.toObject();
        return item;
      });
    }

    // 查询首页播放列表
    const playlists = await SongPlaylist.find({ isModule: true })
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
