import { Schema, model, models } from "mongoose";
import { unique } from "next/dist/build/utils";

const TagSchema = new Schema({
  _id: {
    type: String,
    required: true,
  },
});

TagSchema.index({ _id: 1 }, { unique: true });

const Tag = models.Tag || model("Tag", TagSchema);

export default Tag;
