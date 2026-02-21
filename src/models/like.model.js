import mongoose, { Schema } from "mongoose";

const LikeSchema = new Schema(
  {
    video: {
      type: Schema.Types.ObjectId,
      ref: "Video",
    },
    commnet: {
      type: Schema.Types.ObjectId,
      ref: "Comment",
    },
    tweet: {
      type: Schema.Types.ObjectId,
      ref: "Tweet",
    },
    LikedBy: {
      type: Schema.Types.ObjectId,
      ref: "Like",
    },
  },
  { timestamps: true }
);

export const Like = mongoose.model("Like", LikeSchema);
