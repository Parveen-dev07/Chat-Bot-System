import express from "express";
import userRoutes from "./routes/user.routes.js"
import cors from "cors"
import conversationRoutes from "./routes/conversation.routes.js"
import messageRoutes from "./routes/message.routes.js"
import UploadRoutes from "./routes/uploads.routes.js"
const app = express();

app.use(express.json());
app.use(cors())
app.use("/uploads", express.static("uploads"));
app.get("/",(req,res)=>{
    res.send('route work successfullu')
})
app.use("/api",UploadRoutes)
app.use("/api/user",userRoutes);
app.use("/api/conversation",conversationRoutes);
app.use("/api/message",messageRoutes)

export default app