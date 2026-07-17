import Router from "express";
import { authMiddleware } from "../middleware/auth.middleware.js";
import { GetMessages } from "../controllers/message.controller.js";

const route = Router();


route.get("/get-message/:conversationId",authMiddleware,GetMessages)


export default route