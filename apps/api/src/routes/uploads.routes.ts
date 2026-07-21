import express from "express";
import { upload } from "../middleware/upload.middleware.js";
import { uploadMedia } from "../controllers/upload.controller.js";

const route = express.Router();  

route.post("/upload",upload.single("file"),uploadMedia);


export default route