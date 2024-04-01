import { NextResponse } from "next/server";
import dbConnect from "@/utils/dbconnect";

import Lyrics from "@/models/lyrics";

// Get user info
export async function GET(req) {
  console.log("req", req.nextUrl.searchParams)
  try {
    await dbConnect();

    const data = await Lyrics.findById(req.nextUrl.searchParams.get('id')).exec();
    if (!data) {
      return NextResponse.json(
        {
          success: false,
          message: "Lyrics not found",
          data: null,
        },
        { status: 404 }
      );
    }
    return NextResponse.json({
      success: true,
      essage: "Lyrics found",
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
