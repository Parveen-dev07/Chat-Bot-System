import { Conversation } from "../models/conversation.js";
import { Message } from "../models/message.js";
import { getS3Url } from "../utils/getS3Url.js";

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
    console.log("show payload---->",payload);
    

    
    const message = await Message.create({
      conversation: payload.conversation,
      sender: senderId,
      text: payload.text,
      type: payload.type || "text",
      mediaUrl: payload.mediaUrl,
      replyTo: payload.replyTo,
    });
console.log("show mesasge for check aws s3",message);

   
    conversation.lastMessageBy = message._id;
    conversation.lastMessageAt = new Date();

    await conversation.save();
    const newMessage = await Message.findById(message._id)
  .populate("sender", "name avatar")
  .populate({
    path: "replyTo",
    populate: {
      path: "sender",
      select: "name avatar",
    },
  });
  if(newMessage?.mediaUrl){
    newMessage.mediaUrl = await getS3Url(newMessage?.mediaUrl)
  }

    // return await Message.findById(message._id)
    //   .populate("sender", "name avatar")
    //   .populate({
    //     path: "replyTo",
    //     populate: {
    //       path: "sender",
    //       select: "name avatar",
    //     },
    //   });
    return newMessage
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
  const updatedMessages = await Promise.all(
  messages.map(async (message) => {

    if (message.mediaUrl) {

      message.mediaUrl = await getS3Url(
        message.mediaUrl
      );

    }

    return message;
  })
);

  return {
    messages:updatedMessages,
    pagination: {
      page,
      limit,
      total,
      hasMore: skip + limit < total,
    },
  };
}
};