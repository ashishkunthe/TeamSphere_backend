import mongoose, { Schema } from "mongoose";

const noticeSchema = new Schema({
  title: { type: String, required: true },
  description: { type: String, required: true },
  ownerId: {
    type: Schema.Types.ObjectId,
    required: true,
    ref: "User",
  },
  roomId: { type: Schema.Types.ObjectId, ref: "Room", required: true },
});

export const Notice = mongoose.model("Notice", noticeSchema);
