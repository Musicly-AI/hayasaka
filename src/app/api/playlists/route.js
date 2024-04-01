import { NextResponse } from "next/server";
import dbConnect from "@/utils/dbconnect";
import SongPlaylist from '@/models/songplaylist';

// 根据id获取播放列表
export async function GET(req) {
    try {
        await dbConnect();

        const data = await SongPlaylist.findById(req.nextUrl
            .searchParams.get('id'))
            .populate('artists', 'id name role type url image')
            .populate({
                path: 'songs',
                populate: [
                    { path: 'lyrics', },
                    { path: 'album', select: 'id name url' },
                    { path: 'artists.primary', select: 'id name role type url image' },
                    { path: 'artists.featured', select: 'id name role type url image' },
                    { path: 'artists.all', select: 'id name role type url image' },

                ]
            })
            .exec();
        if (!data) {
            return NextResponse.json(
                {
                    success: false,
                    message: "SongPlaylist not found",
                    data: null,
                },
                { status: 404 }
            );
        }
        return NextResponse.json({
            success: true,
            message: "SongPlaylist found",
            data: data.toJSON(),
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
