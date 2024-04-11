import { NextResponse } from "next/server";
import dbConnect from "@/utils/dbconnect";

import SongPlaylist from "@/models/songplaylist";
import Song from "@/models/song";
import Artist from "@/models/artist";
import Lyrics from "@/models/lyrics";

// Get home data
export async function GET(req) {
  console.log("req", req.nextUrl.searchParams);
  const searchParams = req.nextUrl.searchParams;
  const queryLang = searchParams.get("language");

  try {
    await dbConnect();

    const resData = {
      recommendList: [],
      monthlyList: [],
      songs: [],
      weeklyList: [],
    };

    // find weekly list
    const weeklyPlaylists = await SongPlaylist.find({
      isWeekly: true
    })
      .sort({ createdAt: -1 })
      .exec();

    if (weeklyPlaylists.length > 0) {
      resData.weeklyList = weeklyPlaylists.map((playlist) => {
        const item = playlist.toObject();
        item.title = item.name;
        item.subtitle = item.description;
        item.lastUpdated = item.updatedAt;
        return item;
      });

      // last chinese weekly list
      const chineseWeeklyList = weeklyPlaylists.filter(
        (playlist) => playlist.language === "cmn"
      );
      if (chineseWeeklyList.length > 0) {
        const playlist = chineseWeeklyList[0];
        const item = playlist.toObject();
        item.title = item.name;
        item.subtitle = item.description;
        item.lastUpdated = item.updatedAt;

        resData.recommendList.push(item);
      }

      // last russian weekly list
      const russianWeeklyList = weeklyPlaylists.filter(
        (playlist) => playlist.language === "rus"
      );
      if (russianWeeklyList.length > 0) {
        const playlist = russianWeeklyList[0];
        const item = playlist.toObject();
        item.title = item.name;
        item.subtitle = item.description;
        item.lastUpdated = item.updatedAt;

        resData.recommendList.push(item);
      }

      // last english weekly list
      const englishWeeklyList = weeklyPlaylists.filter(
        (playlist) => playlist.language === "eng"
      );
      if (englishWeeklyList.length > 0) {
        const playlist = englishWeeklyList[0];
        const item = playlist.toObject();
        item.title = item.name;
        item.subtitle = item.description;
        item.lastUpdated = item.updatedAt;

        resData.recommendList.push(item);
      }
    }

    // search last created 20 songs
    const songs = await Song.find({ })
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

    // find all monthly list
    const monthlyPlaylists = await SongPlaylist.find({
      isMonthly: true
    })
      .sort({ createdAt: -1 })
      .exec();

    if (monthlyPlaylists.length > 0) {
      resData.monthlyList = monthlyPlaylists.map((playlist) => {
        const item = playlist.toObject();
        item.title = item.name;
        item.subtitle = item.description;
        item.lastUpdated = item.updatedAt;
        return item;
      });
    }

    return NextResponse.json({
      success: true,
      essage: "Home data",
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
