const mongoose = require("mongoose");

const songSchema = new mongoose.Schema(
  {
    name: String,
    type: String,
    year: Number,
    releaseDate: {
      type: Date,
      default: Date.now,
    },
    duration: Number,
    label: String,
    explicitContent: Boolean,
    playCount: Number,
    language: String,
    hasLyrics: Boolean,
    lyricsId: String,
    isTrending: Boolean,
    praiseCount: Number,
    lyrics: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "lyrics",
    },
    url: String,
    copyright: String,
    suggestionSongs: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "song",
      },
    ],
    album: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "album",
    },
    artists: {
      primary: [
        {
          type: mongoose.Schema.Types.ObjectId,
          ref: "artist",
        },
      ],
      featured: [
        {
          type: mongoose.Schema.Types.ObjectId,
          ref: "artist",
        },
      ],
      all: [
        {
          type: mongoose.Schema.Types.ObjectId,
          ref: "artist",
        },
      ],
    },
    image: [
      {
        quality: String,
        url: String,
      },
    ],
    downloadUrl: [
      {
        quality: String,
        url: String,
      },
    ],
  },
  { timestamps: true }
);

module.exports = mongoose.models.song ||
  mongoose.model("song", songSchema, "song");
