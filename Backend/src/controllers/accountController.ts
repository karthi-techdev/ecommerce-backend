
import { Request, Response } from "express";
import {
  registerUser,
  loginUser,
  getCurrentUser
} from "../services/accountService";
import jwt from "jsonwebtoken";

const SECRET = "SECRET_KEY";

export const register = async (req: Request, res: Response) => {
  try {
    const user = await registerUser(req.body);
    res.json(user);
  } catch (err: any) {
    res.status(400).json({ message: err.message });
  }
};

export const login = async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body;

    const data = await loginUser(email, password);

    res.json(data);
  } catch (err: any) {
    res.status(400).json({ message: err.message });
  }
};

export const getMe = async (req: Request, res: Response) => {
  try {
    const token = req.headers.authorization?.split(" ")[1];

    if (!token) return res.status(401).json({ message: "No token" });

    const decoded: any = jwt.verify(token, SECRET);

    const user = await getCurrentUser(decoded.id);

    res.json(user);
  } catch (err) {
    res.status(401).json({ message: "Invalid token" });
  }
};