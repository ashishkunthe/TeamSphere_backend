import { Router } from "express";
import { loginTypes, registerTypes } from "../types/authTypes";
import { User } from "../models/User";

import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

const route = Router();

route.post("/regiter", async (req, res) => {
  const inputs = registerTypes.safeParse(req.body);

  if (!inputs.success) {
    res.status(402).json({
      messages: "Invalid inputs",
    });
    return;
  }

  try {
    const { email, password, username } = inputs.data;
    const hashedPassword = await bcrypt.hash(password, 10);
    const user = await User.create({
      email,
      username,
      password: hashedPassword,
    });

    const token = jwt.sign(
      { userId: user._id },
      process.env.JWT_SECRET as string
    );

    res.status(201).json({
      message: "User registration completed",
      token: token,
    });
  } catch (error) {
    console.log("Error in registration of user", error);
    res.json({
      message: "Something went wrong",
    });
  }
});

route.post("/login", async (req, res) => {
  const inputs = loginTypes.safeParse(req.body);

  if (!inputs.success) {
    res.json({
      message: "Invalid inputs",
    });
    return;
  }

  try {
    const { email, password } = inputs.data;
    const findUser = await User.findOne({ email });

    if (!findUser) {
      res.status(404).json({
        message: "User is not registered",
      });
      return;
    }

    const decode = await bcrypt.compare(password, findUser.password);

    if (!decode) {
      res.status(403).json({
        message: "Invalid Password",
      });
      return;
    }

    const token = jwt.sign(
      { userId: findUser._id },
      process.env.JWT_SECRET as string
    );

    res.status(200).json({
      message: "Login sucessful",
      token: token,
    });
  } catch (error) {
    console.log("Error in login ", error);
    res.status(500).json({
      message: "Something went wrong",
    });
  }
});

export default route;
