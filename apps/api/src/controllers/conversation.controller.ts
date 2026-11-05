import { Request, Response } from "express";
import { conversationService } from "../services/conversation.service.js";
import { getIO } from "../sockets/socket.js";
import type { Server } from "socket.io";
import type { HydratedDocument } from "mongoose";

const pushConversationToParticipants = async (
    io: Server,
    conversation: HydratedDocument<{ _id: { toString(): string }; participants: { toString(): string }[] }>
) => {
    await conversation.populate("participants", "-password");
    const payload = conversation.toObject();
    const convId = conversation._id.toString();

    for (const participantId of conversation.participants) {
        const pid =
            typeof participantId === "object" &&
            participantId !== null &&
            "_id" in participantId
                ? String((participantId as { _id: unknown })._id)
                : participantId.toString();

        io.in(pid).socketsJoin(convId);
        io.to(pid).emit("new-conversation", payload);
    }
};


export const GetOrCreateConversation = async(req:Request,res:Response)=>{
    try {
        const userId = req.user?.id;
        const {receiverId} = req.body
        if(!receiverId){
            return res.status(400).json({
                message:"Receiver Id is required",
                success:false
            })
        }
        const result = await conversationService.getOrCreatePrivateConversation(userId!,receiverId);

        if (result?.isNew && result.conversation) {
            await pushConversationToParticipants(getIO(), result.conversation);
        }

        res.status(200).json({
            message:result?.isNew ? "Create conversation successfully" : "Fetch conversation successfully",
            success:true,
            result
        })
    } catch (error) {
        const message = error instanceof Error ? error?.message : String(error)
        return res.status(500).json({
            message:'Internal server error',
            success:false,
            error:message
        })
    }

}


export const CreateGroupConversation = async(req:Request,res:Response)=>{
    try {
        const userId = req.user?.id;
        const {groupName, participants} = req.body
        if(!groupName){
            return res.status(400).json({
                message:"Group name is required",
                success:false
            })
        }
        const result = await conversationService.createGroupConversation(
            userId!,
            groupName,
            participants
        )

        await pushConversationToParticipants(getIO(), result.conversation);

        res.status(200).json({
            message:"Create group successfully",
            success:true,
            data:result

        })
    } catch (error) {
        const message = error instanceof Error ? error?.message : String(error);
        return res.status(500).json({
            message:"Inernal server errror",
            success:false,
            error:message
        })
    }
}


export const GetUserConersations = async(req:Request,res:Response)=>{
    try {
        const userId = req.user?.id;
        const {chatType} = req.query

        const result = await conversationService.getUserConversations(
            userId!,
           chatType as "private" | "group" | undefined
        );
        res.status(200).json({
            message:"Fetch conversations successfully",
            success:true,
            data:result
        })
    } catch (error) {
        const message = error instanceof Error ? error?.message : String(error);
        return res.status(500).json({
            message:'Internal server errror',
            success:false,
            error:message
        })
    }
}
