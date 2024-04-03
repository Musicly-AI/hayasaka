const mongoose = require("mongoose");

const playlistSchema = new mongoose.Schema(
  {
    name: String,
    description: String,
    year: Number,
    type: String,
    playCount: Number,
    language: String,
    explicitContent: Boolean,
    songCount: Number,
    isModule: Boolean, // 为 true 时，显示在首页 Featured Playlists 列表
    moduleSortNo: {
      type: Number,
      default: 0,
    }, // 用于排序
    isChart: Boolean, // 为 true 时，显示在首页 Charts 列表 
    chartSortNo: {
      type: Number,
      default: 0,
    }, // 用于排序
    url: String,
    image: [
      {
        quality: String,
        url: String,
      },
    ],
    songs: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "song",
      },
    ],
    artists: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "artist",
      },
    ]
  },
  { timestamps: true }
);

playlistSchema.virtual('id').get(function() {
  return this._id.toHexString();
});

playlistSchema.set('toJSON', { virtuals: true });

module.exports = mongoose.models.songPlaylist ||
  mongoose.model("songPlaylist", playlistSchema, "songPlaylist");
