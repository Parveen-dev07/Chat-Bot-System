

import { Socket } from "socket.io";
import jwt from "jsonwebtoken";

export const socketAuth = (
    socket:Socket,
    next:(err?:Error)=> void
)=>{
    try {
        const token = socket.handshake.auth.token;
        // console.log("show backend token--->",token) 
        if(!token){
            return next(new Error("Unauthorized"))
        }
        const decode = jwt.verify(
            token,
            process.env.JWT_SECRET!
        ) as {id:string}

        socket.data.userId = decode.id
        next()
    } catch (error) {
        next(new Error("Invalid Token"))
    }
}