import mongoose, { Schema } from "mongoose";

const fileSchema = new Schema(
  {
    fileName: { type: String, required: true },
    fileUrl: { type: String, required: true },
    uploadedBy: { type: Schema.Types.ObjectId, required: true, ref: "User" },
    fileType: {
      type: String,
      enum: ["pdf", "png", "jpg", "jpeg", "docx"],
      required: true,
    },
    description: { type: String, required: true },
    roomId: { type: Schema.Types.ObjectId, ref: "Room", required: true },
  },
  {
    timestamps: true,
  }
);

export const Files = mongoose.model("File", fileSchema);
