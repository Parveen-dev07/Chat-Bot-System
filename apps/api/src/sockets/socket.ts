import { Server } from "socket.io";


import { Server as HttpServer } from "http";
import { socketAuth } from "./socketAuth.js";
import { RegisterSockets } from "./events.js";
import { Conversation } from "../models/conversation.js";


let io: Server;

export const initSocket = (server: HttpServer) => {
    io = new Server(server, {
        cors: {
            origin: "*",
        },
    });
    io.use(socketAuth)

    io.on("connection", async (socket) => {
        console.log("User Connected:", socket.id);
        const userId = socket.data.userId as string;
        socket.join(userId);

        try {
            const conversations = await Conversation.find({
                participants: userId,
            }).select("_id");

            for (const conv of conversations) {
                socket.join(conv._id.toString());
            }
        } catch (error) {
            console.error("Failed to join conversation rooms:", error);
        }

        RegisterSockets(socket);
    });

    return io;
};

export const getIO = () => io;