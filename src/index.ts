import express from "express";
import cors from "cors";
import mongoose from "mongoose";

import dotenv from "dotenv";

import authRoutes from "./routes/auth";
import roomRoutes from "./routes/room";
import noticeRoutes from "./routes/notice";
import fileRoutes from "./routes/file";

dotenv.config();

const app = express();

app.use(cors());
app.use(express.json());

app.use("/auth", authRoutes);
app.use("/room", roomRoutes);
app.use("/notice", noticeRoutes);
app.use("/file", fileRoutes);
mongoose
  .connect(process.env.MONGODB_URI as string)
  .then(() => {
    console.log("Mongodb connected");
  })
  .then(() => {
    app.listen(5000, () => {
      console.log("server is running");
    });
  })
  .catch((err) => {
    console.log("Error in connecting to mongodb", err);
  });
