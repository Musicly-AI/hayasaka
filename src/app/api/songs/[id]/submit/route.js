import { NextResponse } from "next/server";
import dbConnect from "@/utils/dbconnect";
import Song from "@/models/song";
import Lyrics from "@/models/lyrics";
import getSongData from "@/utils/getSongData";

// 根据id添加suno歌曲
export async function POST(req, { params }) {
  const id = params.id;

  try {
    await dbConnect();

    // check if song already exists
    const existingSong = await Song.findOne({
      url: { $regex: id, $options: "i" },
    });

    if (existingSong) {
      return NextResponse.json({
        success: false,
        message: "Song already exists",
      });
    }

    // get song data
    const songData = await getSongData(id);
    const lyrics = songData.lyrics;
    const lyricsData = await Lyrics.create(lyrics);
    songData.lyricsId = lyricsData._id;
    songData.lyrics = lyricsData;

    await Song.create(songData);
    return NextResponse.json({
      success: true,
      message: "Song added successfully",
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
