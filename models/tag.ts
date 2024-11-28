import { Schema, model, models } from "mongoose";
import { unique } from "next/dist/build/utils";

const TagSchema = new Schema({
  name: {
    type: String,
    required: true,
    unique: true,
  },
});

const Tag = models.Tag || model("Tag", TagSchema);

export default Tag;
