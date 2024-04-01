import { NextResponse } from "next/server";
import dbConnect from "@/utils/dbconnect";
import Artist from "@/models/artist";
import Album from "@/models/album";
import Song from "@/models/song";
import Lyrics from "@/models/lyrics";

// pages/api/artists/[id]/songs.js
export async function GET(req, { params }) {
  const searchParams = req.nextUrl.searchParams;
  const query = {
    id: params.id,
    page: searchParams.get("page"),
  };

  try {
    // 查询 Song 文档中，artists.all 字段包含当前艺术家 id 的歌曲 , 并且分页
    await dbConnect();
    const data = await Album.find({
      "artists.all": query.id,
    })
      .skip((query.page - 1) * 10)
      .limit(10)
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

    // 获取歌曲总数
    const total = await Album.countDocuments({
      "artists.all": query.id,
    });

    if (!data) {
      return NextResponse.json({
        success: false,
        message: "No albums found for this artist",
        data: {
          total: 0,
          songs: [],
        },
      });
    }

    return NextResponse.json({
      success: true,
      message: "Album found",
      data: {
        total,
        data: data.map((item) => item.toJSON()),
      },
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
