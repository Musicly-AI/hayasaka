import mongoose from "mongoose";
import imageSchema from './image';

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
    image: [imageSchema],
    downloadUrl: [
      {
        quality: String,
        url: String,
      },
    ],
  },
  { timestamps: true }
);

songSchema.virtual('id').get(function() {
  return this._id.toHexString();
});

songSchema.set('toJSON', { virtuals: true });
songSchema.set('toObject', { virtuals: true });

export default mongoose.models.song ||
  mongoose.model("song", songSchema, "song");
