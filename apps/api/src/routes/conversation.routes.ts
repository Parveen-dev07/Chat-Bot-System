import express from "express";
import { CreateGroupConversation, GetOrCreateConversation, GetUserConersations } from "../controllers/conversation.controller.js";
import { authMiddleware } from "../middleware/auth.middleware.js";

const route = express.Router();


route.post("/get-or-create",authMiddleware,GetOrCreateConversation)
route.post("/create-group",authMiddleware,CreateGroupConversation)
route.get("/get-converastion-list",authMiddleware,GetUserConersations)

export default route   