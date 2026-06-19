import { Request, Router } from "express";
import { authMiddleware } from "../middleware/authMiddleware";
import { User } from "../models/User";

const route = Router();

interface requestExtended extends Request {
  userId: string;
}

route.get("/search-users", authMiddleware as () => void, async (req, res) => {
  try {
    const request = req as requestExtended;
    const userId = request.userId;

    const query = req.query.query as string;

    if (!query || query.trim() === "") {
      return res.status(400).json({
        message: "Search query is required",
      });
    }

    const users = await User.find({
      _id: { $ne: userId },
      username: {
        $regex: query,
        $options: "i",
      },
    })
      .select("_id username email")
      .limit(10);

    return res.status(200).json({
      message: "Users found",
      users,
    });
  } catch (error) {
    console.log("Error searching users", error);

    return res.status(500).json({
      message: "Something went wrong",
    });
  }
});

export default route;
