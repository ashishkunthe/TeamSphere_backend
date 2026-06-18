import { Request, Router } from "express";
import { authMiddleware } from "../middleware/authMiddleware";
import { noticeTypes } from "../types/noticeTypes";
import { Notice } from "../models/Notice";
import { Room } from "../models/Rooms";

const route = Router();

interface requestExtended extends Request {
  userId: string;
}

route.post(
  "/create-notice/:roomId",
  authMiddleware as () => void,
  async (req, res) => {
    // @ts-ignore
    const request = req as requestExtended;
    const userId = request.userId;
    const roomId = req.params.roomId;

    const input = noticeTypes.safeParse(req.body);

    if (!input.success) {
      res.status(400).json({
        message: "Invalid inputs",
      });
      return;
    }

    try {
      const { title, description } = input.data;

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

      const notice = await Notice.create({
        title,
        description,
        ownerId: userId,
        roomId,
      });

      res.status(200).json({
        message: "Notice created",
        id: notice._id,
      });
    } catch (error) {
      console.log("Error in creating notice", error);
      res.status(500).json({
        message: "something went wrong",
      });
    }
  }
);

route.get(
  "/notices/:roomId",
  authMiddleware as () => void,
  async (req, res) => {
    // @ts-ignore
    const request = req as requestExtended;
    const roomId = req.params.roomId;

    const userId = request.userId;

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

      const notices = await Notice.find({ roomId }).populate(
        "ownerId",
        "username"
      );

      res.status(200).json({
        message: "Notices present in this room",
        notices: notices,
      });
    } catch (error) {
      console.log("Error getting the notices", error);
      res.status(500).json({
        message: "Something went wrong",
      });
    }
  }
);

route.patch(
  "/update-notice/:noticeId/:roomId",
  authMiddleware as () => void,
  async (req, res) => {
    // @ts-ignore
    const request = req as requestExtended;
    const userId = request.userId;

    const { noticeId, roomId } = req.params;

    try {
      const input = noticeTypes.safeParse(req.body);

      if (!input.success) {
        res.status(402).json({
          message: "Input invalid",
        });
        return;
      }

      const room = await Room.findById(roomId);

      if (!room) {
        res.status(404).json({
          message: "No room found",
        });
        return;
      }

      const isOwner = room.owner.toString() === userId;

      const isMember = room.members.some((id) => id.toString() === userId);

      if (!isOwner && !isMember) {
        return res.status(403).json({
          message: "You are not allowed to performe this operation",
        });
      }

      const notice = await Notice.findById(noticeId);

      if (!notice) {
        res.status(404).json({
          message: "No notice found",
        });
        return;
      }

      if (notice.ownerId.toString() !== userId) {
        res.status(403).json({
          message: "you are not allowed to perform the this action",
        });
        return;
      }

      if (notice.roomId.toString() !== roomId) {
        return res.status(400).json({
          message: "Notice does not belong to this room",
        });
      }
      const { title, description } = input.data;

      await Notice.findByIdAndUpdate(noticeId, {
        title,
        description,
      });

      res.status(200).json({
        message: "Update sucessful",
      });
    } catch (error) {
      console.log("Error in updating notices", error);
      res.status(500).json({
        message: "Something went wrong",
      });
    }
  }
);

route.delete(
  "/delete-notice/:noticeId",
  authMiddleware as () => void,
  async (req, res) => {
    // @ts-ignore
    const request = req as requestExtended;
    const userId = request.userId;

    const noticeId = req.params.noticeId;

    try {
      const findNotice = await Notice.findById(noticeId);

      if (!findNotice) {
        res.status(404).json({
          message: "Notice not found",
        });
        return;
      }

      if (findNotice.ownerId.toString() !== userId) {
        res.status(403).json({
          message: "You are not allowed to perform this action",
        });
        return;
      }

      await Notice.findByIdAndDelete(noticeId);

      res.status(200).json({
        message: "Notice deleted",
      });
    } catch (error) {
      console.log("Error in deleting notice", error);
      res.status(500).json({
        message: "Something went wrong",
      });
    }
  }
);

export default route;
