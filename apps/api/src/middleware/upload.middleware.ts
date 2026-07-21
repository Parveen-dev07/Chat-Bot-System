import { Request } from "express";
import multer from "multer";
import path from "path";

import fs from "fs";

if(!fs.existsSync("uploads")){
    fs.mkdirSync("uploads")
}
const storage = multer.diskStorage({
  destination: (
    req: Request,
    file: Express.Multer.File,
    cb: (error: Error | null, destination: string) => void
  ) => {
    cb(null, "uploads/");
  },

  filename: (
    req: Request,
    file: Express.Multer.File,
    cb: (error: Error | null, filename: string) => void
  ) => {
    const uniqueName =
      `${Date.now()}${path.extname(file.originalname)}`;

    cb(null, uniqueName);
  },
});

export const upload = multer({
  storage,
});