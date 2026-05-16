import { Request, Response } from "express";
import { registerUser, loginUser,updateUserProfile, changeUserPassword} from "../services/usersService";
import { sendEmail } from "../utils/email";
import fs from "fs";
import path from "path";
import jwt from "jsonwebtoken";

export const register = async (req: Request, res: Response) => {
  try {
    const { email, password, username, loginType } = req.body;
    const emailClean = email.trim().toLowerCase();

    console.log("REGISTER API CALLED");

    const user = await registerUser(emailClean, password, username, loginType);

    console.log("USER CREATED");

    res.status(201).json({
      message: "User registered",
      user
    });

    try {
      const filePath = path.join(
        process.cwd(),
        "src/templates/newsletters/welcome-evara.html"
      );

      let html = fs.readFileSync(filePath, "utf-8");

      html = html.replace(/{{name}}/g, username);

      await sendEmail(email, "Welcome 🎉", html);

      console.log("EMAIL SENT");
    } catch (emailError: any) {
      console.log("EMAIL FAILED:", emailError.message);
    }

  } catch (error: any) {
    console.log("---reg err--", error.message);

    res.status(400).json({
      error: error.message
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

    try {
      const filePath = path.join(
        process.cwd(),
        "src/templates/newsletters/welcome-evara.html"
      );

      let html = fs.readFileSync(filePath, "utf-8");

      html = html.replace(/{{name}}/g, user.username || "User");

      await sendEmail(email, "Welcome Back..", html);

      console.log("LOGIN EMAIL SENT");
    } catch (emailError: any) {
      console.log("EMAIL FAILED:", emailError.message);
    }

  } catch (error: any) {
    res.status(400).json({
      error: error.message,
    });
  }

};

  //for update
export const updateProfile = async (req: any, res: Response) => {
  try {
    const userId = req.admin?.id || req.admin?._id;

    if (!userId) {
      return res.status(401).json({ error: "User not authenticated" });
    }

    const { firstName, lastName, username } = req.body;

    const updatedUser = await updateUserProfile(
      userId,
      firstName,
      lastName,
      username
    );

    res.status(200).json({
      message: "Profile updated successfully",
      user: updatedUser,
    });

  } catch (error: any) {
    console.error("UPDATE PROFILE ERROR:", error);
    res.status(500).json({ error: error.message });
  }
};

//for password
export const changePassword = async (req: any, res: Response) => {
  try {
    const userId = req.admin?.id || req.admin?._id;

    const { currentPassword, newPassword } = req.body;

    const user = await changeUserPassword(
      userId,
      currentPassword,
      newPassword
    );

    res.status(200).json({
      message: "Password updated successfully",
      user,
    });

  } catch (error: any) {
    res.status(400).json({ error: error.message });
  }
};