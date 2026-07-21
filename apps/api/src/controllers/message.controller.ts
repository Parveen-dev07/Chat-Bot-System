import { Request, Response } from "express";
import { MessageService } from "../services/message.service.js";


export const GetMessages = async(req:Request,res:Response)=>{
try {
    const page = Number(req.query.page);
    const limit = Number(req.query.limit)

    const {conversationId} = req.params as any

if (!conversationId) {
  return res.status(400).json({
    success: false,
    message: "Conversation ID is required",
  });
}
    const result = await MessageService.getMessage(conversationId,{page,limit})
    res.status(200).json({
        message:'fetch message successfully',success:true,
        data:result
    })

} catch (error) {
    const message = error instanceof Error ? error?.message : "Failed to fetch message"
    return res.status(500).json({
    message:"Internal server error",
    success:false,
    error:message
    })
}
}

