import mongoose from "mongoose";
import imageSchema from './image';

const chartSchema = new mongoose.Schema(
  {
    explicitContent: String,
    firstname: String,
    image: [imageSchema],
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
