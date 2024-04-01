import { NextResponse } from "next/server";
import dbConnect from "@/utils/dbconnect";
import Song from '@/models/song';
import Lyrics from "@/models/lyrics";
import Album from "@/models/album";
import Artist from "@/models/artist";

// 根据id获取歌曲
export async function GET(req) {
    try {
        await dbConnect();

        const data = await Song.findById(req.nextUrl
            .searchParams.get('id'))
            .populate('lyrics')
            .populate('album', 'id name url')
            .populate('artists.primary', 'id name role type url image')
            .populate('artists.featured', 'id name role type url image')
            .populate('artists.all', 'id name role type url image')
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
        return NextResponse.json({
            success: true,
            message: "Song found",
            data: [data.toJSON()],
        });
    }
    catch (e) {
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
