import { Request, Response } from "express";
import { registerUser, loginUser } from "../services/usersService";
import { sendEmail } from "../utils/email";
import fs from "fs";
import path from "path";

export const register = async (req: Request, res: Response) => {
  try {
    const { email, password, username } = req.body;
    const emailClean = email.trim().toLowerCase();

    console.log("🚀 REGISTER API CALLED");

    const user = await registerUser(emailClean, password, username);

    console.log("✔ USER CREATED");

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

      console.log("✔ EMAIL SENT");
    } catch (emailError: any) {
      console.log("⚠ EMAIL FAILED:", emailError.message);
    }

  } catch (error: any) {
    console.log("❌ REGISTER ERROR:", error.message);

    res.status(400).json({
      error: error.message
    });
  }
};

export const login = async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body;

    const user = await loginUser(email, password);

    res.status(200).json({
      message: "Login successful",
      user,
    });

    try {
      const filePath = path.join(
        process.cwd(),
        "src/templates/newsletters/welcome-evara.html"
      );

      let html = fs.readFileSync(filePath, "utf-8");

      html = html.replace(/{{name}}/g, user.username || "User");

      await sendEmail(email, "Welcome Back 👋", html);

      console.log("✔ LOGIN EMAIL SENT");
    } catch (emailError: any) {
      console.log("⚠ EMAIL FAILED:", emailError.message);
    }

  } catch (error: any) {
    res.status(400).json({
      error: error.message,
    });
  }
};