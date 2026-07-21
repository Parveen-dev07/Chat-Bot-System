import { Server } from "socket.io";


import { Server as HttpServer } from "http";
import { socketAuth } from "./socketAuth.js";
import { RegisterSockets } from "./events.js";


let io: Server;

export const initSocket = (server: HttpServer) => {
    io = new Server(server, {
        cors: {
            origin: "*",
             methods: ["GET", "POST"],
        },
    });
    io.use(socketAuth)

    io.on("connection", (socket) => {
        console.log("User Connected:", socket.id);
        RegisterSockets(socket)

       
    });

    return io;
};

export const getIO = () => io;