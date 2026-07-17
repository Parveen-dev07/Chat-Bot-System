import { Server, Socket } from "socket.io";
import { MessageService } from "../services/message.service.js";
import { getIO } from "./socket.js";

export const RegisterSockets = (socket:Socket)=>{
    
         socket.on("join-conversation",(conversationId:string)=>{
              
        socket.join(conversationId);
        console.log(`User ${socket.data.userId} join ${conversationId}`);
        

         })
         socket.on("send-message",async(payload)=>{
            console.log("show send message payloaf---->",payload);
            
        const io = getIO()
        try {
        const senderId = socket.data.userId;
        const message = await MessageService.sendMessage(senderId,payload);
         console.log("show message from db-->",message);
         
        io.to(payload.conversation).emit('receive-message',message);
        
            
        } catch (error) {
            socket.emit("error-message",{
                success:false,
                message:
                error instanceof Error ? error?.message : "Unable to send message"
            })
        }
         });

         socket.on("typing",()=>{

         })

         socket.on("stop-typing",()=>{

         })



    socket.on("disconnect",()=> {
          console.log("User Disconnected:", socket.id);   
    })
}








