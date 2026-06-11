import mongoose, { Schema } from "mongoose";

const roomSchema = new Schema({
  name: { type: String, required: true },
  owner: { type: Schema.Types.ObjectId, ref: "User", required: true },
  members: [{ type: Schema.Types.ObjectId, ref: "User" }],
  description: { type: String, default: "" },
});

export const Room = mongoose.model("Room", roomSchema);
