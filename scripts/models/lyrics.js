const mongoose = require("mongoose");

const lyricsSchema = new mongoose.Schema(
  {
    lyrics: String,
    copyright: String,
    snippet: String,
  },
  { timestamps: true }
);

lyricsSchema.virtual('id').get(function() {
  return this._id.toHexString();
});

lyricsSchema.set('toJSON', { virtuals: true });

module.exports = mongoose.models.song ||
  mongoose.model("lyrics", lyricsSchema, "lyrics");