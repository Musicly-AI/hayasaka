const mongoose = require("mongoose");

const albumSchema = new mongoose.Schema(
  {
    name: String,
    url: String,
    description: String,
    year: Number,
    type: String,
    playCount: Number,
    language: String,
    explicitContent: Boolean,
    songCount: Number,
    isModule: Boolean,
    isTrending: Boolean,
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
    songs: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "song",
      },
    ],
  },
  { timestamps: true }
);

albumSchema.virtual('id').get(function() {
  return this._id.toHexString();
});

albumSchema.set('toJSON', { virtuals: true });
albumSchema.set('toObject', { virtuals: true });

export default mongoose.models.album ||
  mongoose.model("album", albumSchema, "album");
