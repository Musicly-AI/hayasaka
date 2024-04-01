const mongoose = require("mongoose");

const artistSchema = new mongoose.Schema(
  {
    name: String,
    role: String,
    type: String,
    image: [
      {
        quality: String,
        url: String,
      },
    ],
    url: String,
    followerCount: Number,
    fanCount: Number,
    isVerified: Boolean,
    dominantLanguage: String,
    dominantType: String,
    bio: String,
    dob: String,
    fb: String,
    twitter: String,
    wiki: String,
    availableLanguages: [ String ],
    isRadioPresent: Boolean,
    topSongs: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "song",
      },
    ],
    topAlbums: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "album",
      },
    ],
    singles: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "song",
      },
    ],
    similarArtists: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "artist",
      },
    ],
  },
  { timestamps: true }
);

artistSchema.virtual('id').get(function() {
  return this._id.toHexString();
});

artistSchema.set('toJSON', { virtuals: true });
artistSchema.set('toObject', { virtuals: true });

export default mongoose.models.artist ||
  mongoose.model("artist", artistSchema, "artist");
