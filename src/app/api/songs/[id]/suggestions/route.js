import { NextResponse } from "next/server";
import dbConnect from "@/utils/dbconnect";
import Song from "@/models/song";
import Lyrics from "@/models/lyrics";
import Album from "@/models/album";
import Artist from "@/models/artist";

// 根据id获取歌曲
export async function GET(req, { params }) {
  const id = params.id;

  try {
    await dbConnect();

    // 获取当前歌曲的 suggestionSongs

    const data = await Song.findById(id)
      .populate({
        path: "suggestionSongs",
        populate: [
          { path: "lyrics" },
          { path: "album", select: "id name url" },
          { path: "artists.primary", select: "id name role type url image" },
          { path: "artists.featured", select: "id name role type url image" },
          { path: "artists.all", select: "id name role type url image" },
        ],
      })
      .exec();
    if (!data) {
      return NextResponse.json(
        {
          success: false,
          message: "Song not found",
          data: null,
        },
        { status: 404 }
      );
    }
    if (!data.suggestionSongs) {
      return NextResponse.json({
        success: true,
        message: "Song has no suggestions",
        data: [],
      });
    }
    return NextResponse.json({
      success: true,
      message: "Song found",
      data: data.suggestionSongs.map((song) => song.toJSON()),
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
