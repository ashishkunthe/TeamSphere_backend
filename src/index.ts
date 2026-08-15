import express from "express";
import cors from "cors";
import mongoose from "mongoose";
import cookieParser from "cookie-parser";

import { createServer } from "http";
import { WebSocketServer } from "ws";

import dotenv from "dotenv";

import authRoutes from "./routes/auth";
import roomRoutes from "./routes/room";
import noticeRoutes from "./routes/notice";
import fileRoutes from "./routes/file";
import usersRoutes from "./routes/user";
import {
  addConnectionsToRoom,
  removeConnectionFromRoom,
} from "./websocket/websocket";
import { Room } from "./models/Rooms";

dotenv.config();

const app = express();

app.use(
  cors({
    origin: process.env.FRONTEND_ORIGIN,
    credentials: true,
  })
);
app.use(express.json());

app.use(cookieParser());

app.use("/auth", authRoutes);
app.use("/room", roomRoutes);
app.use("/notice", noticeRoutes);
app.use("/file", fileRoutes);
app.use("/user", usersRoutes);

mongoose
  .connect(process.env.MONGODB_URI as string)
  .then(() => {
    console.log("Mongodb connected");
  })
  .then(() => {
    const server = createServer(app);

    const wss = new WebSocketServer({
      server,
    });

    wss.on("connection", async (socket, request) => {
      console.log("Websocket server connected", request.url);

      const url = new URL(request.url || "", `http://${request.headers.host}`);

      const roomId = url.searchParams.get("roomId");

      if (!roomId) {
        socket.close();
        return;
      }

      const room = await Room.findById(roomId);

      if (!room) {
        return;
      }

      addConnectionsToRoom(roomId, socket);

      console.log("socket connection added to", roomId);

      socket.on("close", () => {
        removeConnectionFromRoom(roomId, socket);
        console.log("Socket is removed from the room", roomId);
      });
    });

    server.listen(process.env.PORT, () => {
      console.log("Server is running");
    });
  })
  .catch((err) => {
    console.log("Error in connecting to mongodb", err);
  });
