import { NextResponse } from "next/server";
import dbConnect from "@/utils/dbconnect";
import Artist from "@/models/artist";
import Album from "@/models/album";
import Song from "@/models/song";
import Lyrics from "@/models/lyrics";

// 根据id获取艺术家
export async function GET(req) {
  try {
    await dbConnect();

    const data = await Artist.findById(req.nextUrl.searchParams.get("id"))
      .populate({
        path: "topSongs",
        populate: [
          { path: "lyrics" },
          { path: "album", select: "id name url" },
          { path: "artists.primary", select: "id name role type url image" },
          { path: "artists.featured", select: "id name role type url image" },
          { path: "artists.all", select: "id name role type url image" },
        ],
      })
      .populate({
        path: "singles",
        populate: [
          { path: "lyrics" },
          { path: "album", select: "id name url" },
          { path: "artists.primary", select: "id name role type url image" },
          { path: "artists.featured", select: "id name role type url image" },
          { path: "artists.all", select: "id name role type url image" },
        ],
      })
      .populate({
        path: "topAlbums",
        populate: [
          { path: "artists.primary", select: "id name role type url image" },
          { path: "artists.featured", select: "id name role type url image" },
          { path: "artists.all", select: "id name role type url image" },
          {
            path: "songs",
            populate: [
              { path: "lyrics" },
              { path: "album", select: "id name url" },
              {
                path: "artists.primary",
                select: "id name role type url image",
              },
              {
                path: "artists.featured",
                select: "id name role type url image",
              },
              { path: "artists.all", select: "id name role type url image" },
            ],
          },
        ],
      })
      .exec();
    if (!data) {
      return NextResponse.json(
        {
          success: false,
          message: "Album not found",
          data: null,
        },
        { status: 404 }
      );
    }
    return NextResponse.json({
      success: true,
      message: "Artist found",
      data: data.toJSON(),
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
