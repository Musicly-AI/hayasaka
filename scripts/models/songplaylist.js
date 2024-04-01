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
    isModule: Boolean,
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
