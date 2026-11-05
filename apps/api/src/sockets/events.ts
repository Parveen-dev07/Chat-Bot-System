import { Server, Socket } from "socket.io";
import { MessageService } from "../services/message.service.js";
import { getIO } from "./socket.js";
import { Message } from "../models/message.js";

export const RegisterSockets = (socket: Socket) => {

    socket.on("join-conversation", (conversationId: string) => {

        socket.join(conversationId);
        console.log(`User ${socket.data.userId} join ${conversationId}`);


    })
    socket.on("send-message", async (payload) => {
        console.log("show send message payloaf---->", payload);

        const io = getIO()
        try {
            const senderId = socket.data.userId;
            const message = await MessageService.sendMessage(senderId, payload);
            console.log("show message from db-->", message);

            const roomId = String(payload.conversation);
            io.to(roomId).emit("receive-message", message);



        } catch (error) {
            socket.emit("error-message", {
                success: false,
                message:
                    error instanceof Error ? error?.message : "Unable to send message"
            })
        }
    });
    socket.on("message-delivered", async ({ messageId }) => {
        try {
            const io = getIO();
            const readerId = socket.data.userId as string;

            const existing = await Message.findById(messageId);
            if (!existing) return;
            if (existing.sender.toString() === readerId) return;
            if (existing.status === "seen") return;

            const message = await Message.findByIdAndUpdate(
                messageId,
                { status: "delivered" },
                { new: true }
            );

            if (!message) return;

            io.to(message.conversation.toString()).emit("message-delivered", {
                conversationId: message.conversation.toString(),
                messageId: message._id.toString(),
                status: message.status,
            });

        } catch (error) {
            socket.emit("error-message", {
                success: false,
                message: error instanceof Error
                    ? error.message
                    : "Unable to update message status",
            });
        }
    });
    socket.on("message-seen", async({ messageId }) => {
  try {
    const io = getIO();
    const readerId = socket.data.userId as string;

    const existing = await Message.findById(messageId);
    if (!existing) return;
    if (existing.sender.toString() === readerId) return;

    const message = await Message.findByIdAndUpdate(
        messageId,
        {
            status: "seen",
            $addToSet: { seenBy: readerId },
        },
        { new: true }
    );
    if(!message) return;
    io.to(message.conversation.toString()).emit("message-seen",{
        conversationId:message.conversation.toString(),
        messageId:message._id.toString(),
        status:message.status
    })
  } catch (error) {
     socket.emit("error-message", {
                success: false,
                message: error instanceof Error
                    ? error.message
                    : "Unable to update message status",
            });
  }
    })
   socket.on("conversation-opened", async ({ conversationId }) => {
    const io = getIO();

  const message =  await Message.updateMany(
        {
            conversation: conversationId,
            sender: { $ne: socket.data.userId },
            seenBy: { $ne: socket.data.userId },
        },
        {
            $set: {
                status: "seen",
            },
            $addToSet: {
                seenBy: socket.data.userId,
            },
        }
    );

    io.to(conversationId).emit("message-seen", {
        conversationId,
    //    messageId:message.conversation,
        status: "seen",
    });
});

    socket.on("typing", () => {

    })

    socket.on("stop-typing", () => {

    })



    socket.on("disconnect", () => {
        console.log("User Disconnected:", socket.id);
    })
}








