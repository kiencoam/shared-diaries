import { Schema, model, models } from "mongoose";

const PostSchema = new Schema({
  content: {
    type: String,
    required: [true, "Content is required"],
  },
  creator: {
    type: Schema.Types.ObjectId,
    ref: "User",
  },
  tags: [
    {
      type: Schema.Types.ObjectId,
      ref: "Tag",
    },
  ],
  likes: [
    {
      type: Schema.Types.ObjectId,
      ref: "User",
    },
  ],
  likeConut: {
    type: Number,
    default: 0,
    required: true,
  },
});

const Post = models.Post || model("Post", PostSchema);

export default Post;
