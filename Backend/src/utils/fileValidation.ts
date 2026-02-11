import { Request } from "express";
import multer from "multer";
import path from "path";
import {CustomError} from "./customError";

// ✅ Allowed image types
const allowedMimeTypes = [
  "image/jpeg",
  "image/jpg",
  "image/png",
  "image/webp",
];


export const imageFileFilter = (
  req: Request,
  file: Express.Multer.File,
  cb: multer.FileFilterCallback
) => {
  if (!allowedMimeTypes.includes(file.mimetype)) {
    return cb(
      new CustomError("Only image files are allowed", 400)
    );
  }

  cb(null, true);
};
