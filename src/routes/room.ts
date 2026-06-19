import { Request, Router } from "express";
import { authMiddleware } from "../middleware/authMiddleware";
import { Room } from "../models/Rooms";
import { roomCreateTypes } from "../types/roomTypes";

const route = Router();

interface requestExtended extends Request {
  userId: string;
}

route.post("/create-room", authMiddleware as () => void, async (req, res) => {
  const request = req as requestExtended;
  const userId = request.userId;

  const inputs = roomCreateTypes.safeParse(req.body);

  if (!inputs.success) {
    res.json({
      message: "Invalid inputs",
    });
    return;
  }

  try {
    const { name, description } = inputs.data;
    const room = await Room.create({ name, description, owner: userId });

    res.status(200).json({
      message: "Room created successfully",
      roomId: room._id,
    });
  } catch (error) {
    console.log("error in creating the room", error);
    res.status(500).json({
      message: "Somthing went wrong",
    });
  }
});

route.get("/get-my-rooms", authMiddleware as () => void, async (req, res) => {
  const request = req as requestExtended;
  const userId = request.userId;

  try {
    const rooms = await Room.find({ owner: userId });

    if (!rooms) {
      res.status(200).json({
        message: "No rooms created yet",
      });
      return;
    }

    res.status(200).json({
      message: "All Rooms created",
      rooms: rooms,
    });
  } catch (error) {
    console.log("Error in getting the my rooms", error);
    res.status(500).json({
      message: "Something went wrong",
    });
  }
});

route.get(
  "/get-my-rooms/:roomId",
  authMiddleware as () => void,
  async (req, res) => {
    // @ts-ignore
    const request = req as requestExtended;
    const userId = request.userId;
    const roomId = req.params.roomId;

    try {
      const room = await Room.findById(roomId).populate("members");

      if (!room) {
        res.status(404).json({
          message: "Room not found",
        });
        return;
      }

      if (!room.owner.equals(userId)) {
        res.status(403).json({
          message: "Only room owner can access this route",
        });
        return;
      }

      res.status(200).json({
        message: "room details",
        room: room,
      });
    } catch (error) {
      console.log("Error in getting the room for perticular id", error);
      res.status(500).json({
        message: "Something went wrong",
      });
    }
  }
);

route.post(
  "/add-member/:roomId",
  authMiddleware as () => void,
  async (req, res) => {
    // @ts-ignore
    const request = req as requestExtended;
    const userId = request.userId;
    const roomId = req.params.roomId;

    try {
      const { memberId } = req.body;

      if (!memberId) {
        res.status(401).json({
          message: "member is required",
        });
        return;
      }

      if (memberId === userId) {
        return res.status(400).json({
          message: "You are already the room owner",
        });
      }

      const findRoom = await Room.findById(roomId);

      if (!findRoom) {
        res.status(404).json({
          message: "No room found",
        });
        return;
      }

      if (!findRoom.owner.equals(userId)) {
        res.status(403).json({
          message: "You are not allowed to perform this action",
        });
        return;
      }

      const alreadyMember = findRoom.members.some(
        (id) => id.toString() === memberId
      );

      if (alreadyMember) {
        return res.status(400).json({
          message: "User already exists in room",
        });
      }

      findRoom.members.push(memberId);
      await findRoom.save();

      res.status(200).json({
        message: "Member added successfully",
      });
    } catch (error) {
      console.log("error in adding members", error);
      res.status(500).json({
        message: "Something went wrong",
      });
    }
  }
);

route.delete(
  "/delete-member/:roomId",
  authMiddleware as () => void,
  async (req, res) => {
    // @ts-ignore
    const request = req as requestExtended;
    const userId = request.userId;

    const roomId = req.params.roomId;

    try {
      const { memberId } = req.body;
      const findRoom = await Room.findById(roomId);

      if (!findRoom) {
        res.status(404).json({
          message: "Room not found",
        });
        return;
      }

      if (!memberId) {
        return res.status(400).json({
          message: "memberId is required",
        });
      }

      if (!findRoom.owner.equals(userId)) {
        res.status(403).json({
          message: "You are not allowed to performe this action",
        });
        return;
      }

      if (memberId === userId) {
        return res.status(400).json({
          message: "Room owner cannot be removed",
        });
      }

      await Room.findByIdAndUpdate(roomId, {
        $pull: {
          members: memberId,
        },
      });

      res.status(200).json({
        message: "The member deleted ",
      });
    } catch (error) {
      console.log("Error in deleting member", error);
      res.status(500).json({
        message: "Something went wrong",
      });
    }
  }
);

route.get("/joined-rooms", authMiddleware as () => void, async (req, res) => {
  const request = req as requestExtended;
  const userId = request.userId;

  try {
    const rooms = await Room.find({
      members: userId,
    });

    res.status(200).json({
      message: "All the rooms",
      rooms: rooms,
    });
  } catch (error) {
    console.log("Error fetching joined rooms", error);

    res.status(500).json({
      message: "Something went wrong",
    });
  }
});

route.get(
  "/joined-rooms/:roomId",
  authMiddleware as () => void,
  async (req, res) => {
    // @ts-ignore
    const request = req as requestExtended;
    const userId = request.userId;

    const roomId = req.params.roomId;

    try {
      const room = await Room.findById(roomId)
        .populate("members", "username email")
        .populate("owner", "username email");

      if (!room) {
        return res.status(404).json({
          message: "Room not found",
        });
      }

      const isMember = room.members.some(
        (member: any) => member._id.toString() === userId
      );

      if (!isMember) {
        return res.status(403).json({
          message: "You are not a member of this room",
        });
      }

      res.status(200).json({
        message: "Room details fetched",
        room,
      });
    } catch (error) {
      console.log("Error fetching room details", error);

      res.status(500).json({
        message: "Something went wrong",
      });
    }
  }
);
export default route;
