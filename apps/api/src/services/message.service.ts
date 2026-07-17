import { Conversation } from "../models/conversation.js";
import { Message } from "../models/message.js";

interface SendMessagePayload {
  conversation: string;
  text?: string;
  type?: "text" | "image" | "video" | "audio" | "file";
  mediaUrl?: string;
  replyTo?: string;
}
interface MessagePagination {
  
  page:number;
  limit:number;
  search?:string

}



export const MessageService = {
  async sendMessage(
    senderId: string,
    payload: SendMessagePayload
  ) {
    
    if (!payload.conversation) {
      throw new Error("Conversation id is required");
    }

    
    const conversation = await Conversation.findById(payload.conversation);

    if (!conversation) {
      throw new Error("Conversation not found");
    }

    
    const message = await Message.create({
      conversation: payload.conversation,
      sender: senderId,
      text: payload.text,
      type: payload.type || "text",
      mediaUrl: payload.mediaUrl,
      replyTo: payload.replyTo,
    });

   
    conversation.lastMessageBy = message._id;
    conversation.lastMessageAt = new Date();

    await conversation.save();

    return await Message.findById(message._id)
      .populate("sender", "name avatar")
      .populate({
        path: "replyTo",
        populate: {
          path: "sender",
          select: "name avatar",
        },
      });
  },

  async getMessage(
  conversationId: string,
  payload: MessagePagination
) {
  
  if (!conversationId) {
    throw new Error("Conversation ID is required");
  }

  
  const conversation = await Conversation.findById(conversationId);

  if (!conversation) {
    throw new Error("Conversation not found");
  }

  
  const page = Number(payload.page) || 1;
  const limit = Number(payload.limit) || 20;
  const skip = (page - 1) * limit;

  
  const messages = await Message.find({
    conversation: conversationId,
  })
    .sort({ createdAt: -1 })
    .skip(skip)
    .limit(limit)
    .populate("sender", "name avatar")
    .populate({
      path: "replyTo",
      populate: {
        path: "sender",
        select: "name avatar",
      },
    });

 
  const total = await Message.countDocuments({
    conversation: conversationId,
  });

  
  messages.reverse();

  return {
    messages,
    pagination: {
      page,
      limit,
      total,
      hasMore: skip + limit < total,
    },
  };
}
};