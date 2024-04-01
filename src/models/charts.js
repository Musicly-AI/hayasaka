import mongoose from "mongoose";

const chartSchema = new mongoose.Schema(
  {
    explicitContent: String,
    firstname: String,
    image: [
      {
        quality: String,
        url: String,
      }
    ],
    language: String,
    subtitle: String,
    title: String,
    type: String,
    url: String,
    isModule: Boolean,
  },
  { timestamps: true }
);

chartSchema.virtual('id').get(function() {
  return this._id.toHexString();
});

chartSchema.set('toJSON', { virtuals: true });
chartSchema.set('toObject', { virtuals: true });

export default mongoose.models.charts ||
  mongoose.model("charts", chartSchema, "charts");
