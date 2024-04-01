import { NextResponse } from "next/server";
import dbConnect from "@/utils/dbconnect";
import SongPlaylist from "@/models/songplaylist";
import Song from "@/models/song";
import Album from "@/models/album";
import Artist from "@/models/artist";

// 根据id获取播放列表
export async function GET(req) {
  const searchParams = req.nextUrl.searchParams;
  const queryStr = searchParams.get("query");
  try {
    await dbConnect();

    const resData = {
      albums: {
        results: [],
        position: 1,
      },
      songs: {
        results: [],
        position: 1,
      },
      artists: {
        results: [],
        position: 1,
      },
      playlists: {
        results: [],
        position: 1,
      },
      topQuery: {
        results: [],
        position: 1,
      },
    };

    // 查询 name 包含 queryStr 的专辑
    const albums = await Album.find(
      {
        name: { $regex: queryStr, $options: "i" },
      },
      "_id name image artist url type description year language songs"
    )
      .populate("artists.primary", "id name role type url image")
      .populate("artists.featured", "id name role type url image")
      .populate("artists.all", "id name role type url image")
      .exec();
    if (albums.length > 0) {
      resData.albums.results = albums.map((album) => {
        const item = album.toObject();
        item.title = item.name;
        if (item.songs && item.songs.length > 0) {
          item.songIds = item.songs.map((song) => song._id);
        }

        return item;
      });
    }

    // 查询name 包含 queryStr 的歌曲
    const songs = await Song.find(
      {
        name: { $regex: queryStr, $options: "i" },
      },
      "_id name url album artists image type description language"
    )
      .populate("album", "id name url")
      .populate("artists.primary", "id name role type url image")
      .populate("artists.featured", "id name role type url image")
      .populate("artists.all", "id name role type url image")
      .exec();

      if (songs.length > 0) {
        resData.songs.results = songs.map((song) => {
          const item = song.toObject();
          item.title = item.name;

          if (item.artists.primary && item.artists.primary.length > 0) { 
            item.primaryArtists = item.artists.primary;
            item.singers = item.artists.primary[0];
          }
          return item;
        });
      }

      // 查询name 包含 queryStr 的歌手
      const artists = await Artist.find(
        {
          name: { $regex: queryStr, $options: "i" },
        },
        "_id name image type description"
      ).exec();

      if (artists.length > 0) {
        resData.artists.results = artists.map((artist) => {
          const item = artist.toObject();
          item.title = item.name;
          return item;
        });
      }

      // 查询name 包含 queryStr 的播放列表
      const playlists = await SongPlaylist.find(
        {
          name: { $regex: queryStr, $options: "i" },
        },
        "_id name url description image type language"
      ).exec();

      if (playlists.length > 0) {
        resData.playlists.results = playlists.map((playlist) => {
          const item = playlist.toObject();
          item.title = item.name;
          return item;
        });
      }

    return NextResponse.json({
      success: true,
      message: "Search successful",
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
