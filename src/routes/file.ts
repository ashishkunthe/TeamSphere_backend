import { Request, Router } from "express";
import { authMiddleware } from "../middleware/authMiddleware";
import { upload } from "../services/multer";
import { Room } from "../models/Rooms";
import { supabase } from "../services/supabaseClient";
import { Files } from "../models/Files";
import { fileTypes } from "../types/fileTypes";
import mongoose from "mongoose";
import { broadCastToRoom } from "../websocket/websocket";
import { User } from "../models/User";

const route = Router();

interface requestExtended extends Request {
  userId: string;
}

route.post(
  "/upload-file/:roomId",
  authMiddleware as () => void,
  upload.single("file"),
  async (req, res) => {
    const request = req as requestExtended;
    const userId = request.userId;
    const roomId = req.params.roomId as string;
    const file = req.file;

    try {
      const inputs = fileTypes.safeParse(req.body);

      if (!inputs.success) {
        return res.status(400).json({
          message: "Invalid inputs",
        });
      }

      if (!file) {
        return res.status(400).json({
          message: "File is required",
        });
      }

      const room = await Room.findById(roomId);

      if (!room) {
        return res.status(404).json({
          message: "Room not found",
        });
      }

      const isOwner = room.owner.toString() === userId;

      const isMember = room.members.some((id) => id.toString() === userId);

      if (!isOwner && !isMember) {
        return res.status(403).json({
          message: "You are not in this room",
        });
      }

      const allowedTypes = [
        "application/pdf",
        "image/png",
        "image/jpeg",
        "image/jpg",
        "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
      ];

      if (!allowedTypes.includes(file.mimetype)) {
        return res.status(400).json({
          message: "Unsupported file type",
        });
      }

      const fileName = `${Date.now()}-${file.originalname
        .replace(/\s+/g, "-")
        .replace(/[^\w.-]/g, "")}`;

      const { error } = await supabase.storage
        .from("TeamSpherefiles")
        .upload(fileName, file.buffer, {
          contentType: file.mimetype,
        });

      if (error) {
        throw error;
      }

      const { data: publicData } = supabase.storage
        .from("TeamSpherefiles")
        .getPublicUrl(fileName);

      const { description } = inputs.data;

      const fileType = file.originalname.split(".").pop()?.toLowerCase();

      const uploadedFile = await Files.create({
        fileName: file.originalname,
        description,
        fileUrl: publicData.publicUrl,
        fileType: fileType as "pdf" | "png" | "jpg" | "jpeg" | "docx",
        roomId: new mongoose.Types.ObjectId(roomId),
        uploadedBy: new mongoose.Types.ObjectId(userId),
      });

      const user = await User.findById(userId);

      if (!user) {
        return res.status(404).json({
          message: "something went wrong",
        });
      }

      broadCastToRoom(roomId, {
        type: "NEW_FILE",
        file: {
          id: uploadedFile._id,
          fileName: uploadedFile.fileName,
          fileUrl: uploadedFile.fileUrl,
          description: uploadedFile.description,
          uploadedBy: {
            username: user?.username,
          },
        },
      });

      return res.status(201).json({
        message: "File uploaded successfully",
        fileUrl: publicData.publicUrl,
        id: uploadedFile._id,
      });
    } catch (error) {
      console.error("Error uploading file:", error);

      return res.status(500).json({
        message: "Something went wrong",
      });
    }
  }
);

route.get("/files/:roomId", authMiddleware as () => void, async (req, res) => {
  // @ts-ignore
  const request = req as requestExtended;
  const userId = request.userId;
  const roomId = req.params.roomId;

  try {
    const room = await Room.findById(roomId);

    if (!room) {
      res.status(404).json({
        message: "Room not found",
      });
      return;
    }

    const isOwner = room.owner.toString() === userId;

    const isMember = room.members.some((id) => id.toString() === userId);

    if (!isOwner && !isMember) {
      return res.status(403).json({
        message: "You are not in this room",
      });
    }

    const files = await Files.find({ roomId })
      .populate("uploadedBy", "username")
      .populate("roomId", "name")
      .sort({ createdAt: -1 });

    res.status(200).json({
      message: "Files fetched",
      files: files,
    });
  } catch (error) {
    console.log("Error in fetching files of room", error);
    res.status(500).json({
      message: "Something went wrong",
    });
  }
});

route.delete(
  "/delete-file/:roomId/:fileId",
  authMiddleware as () => void,
  async (req, res) => {
    // @ts-ignore
    const request = req as requestExtended;
    const userId = request.userId;
    const roomId = req.params.roomId;
    const fileId = req.params.fileId;

    try {
      const room = await Room.findById(roomId);

      if (!room) {
        res.status(403).json({
          message: "Room not found",
        });
        return;
      }

      const isOwner = room.owner.toString() === userId;

      const isMember = room.members.some((id) => id.toString() === userId);

      if (!isOwner && !isMember) {
        return res.status(403).json({
          message: "You are not in this room",
        });
      }

      const file = await Files.findById(fileId);

      if (!file) {
        res.status(404).json({
          message: "file not exist",
        });
        return;
      }

      if (file.roomId.toString() !== roomId) {
        return res.status(400).json({
          message: "File does not belong to this room",
        });
      }

      if (file.uploadedBy.toString() !== userId) {
        res.status(403).json({
          message: "you're not allowed to perform this action",
        });
        return;
      }

      const { error } = await supabase.storage
        .from("TeamSpherefiles")
        .remove([file.fileName]);

      if (error) {
        throw error;
      }

      await Files.findByIdAndDelete(fileId);

      res.status(200).json({
        message: "File deleted sucessfully",
      });
    } catch (error) {
      console.log("Error in deleting file", error);
      res.status(500).json({
        message: "Something went wrong",
      });
    }
  }
);

export default route;
