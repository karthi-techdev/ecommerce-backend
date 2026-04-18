import { Request, Response } from "express";
import {
  registerUser,
  loginUser,
} from "../services/usersService";
import jwt from "jsonwebtoken";

export const register = async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body;

    const user = await registerUser(email, password);

    res.status(201).json({
      message: "User registered",
      user,
    });
  } catch (error: any) {
    res.status(400).json({
      error: error.message,
    });
  }
};

export const login = async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body;

    const user = await loginUser(email, password);
const secret = process.env.JWT_SECRET || "your-secure-jwt-secret-min-32-chars";


const token = jwt.sign(
  { id: user._id },
  secret,
  { expiresIn: "7d" }
);

    res.status(200).json({
      message: "Login successful",
      user,
      token,
    });
  } catch (error: any) {
    res.status(400).json({
      error: error.message,
    });
  }
};