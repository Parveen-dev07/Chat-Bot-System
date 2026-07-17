import { Conversation } from "../models/conversation.js";
import { Message } from "../models/message.js";


interface GConversation {
  senderId: string;
  conversationId: string;
  receiverId: string

}
export const conversationService = {

  async getOrCreatePrivateConversation(
    userId: string,
    receiverId: string
  ) {
    console.log("show userId---->", userId);
    console.log("show receivcer i---->", receiverId);

    if (userId.toString() === receiverId.toString()) {
      throw new Error("You cannot create a conversation with yourself");
    }

    let conversation = await Conversation.findOne({
      type: "private",
      participants: {
        $all: [userId, receiverId],
      },
      $expr: {
        $eq: [{ $size: "$participants" }, 2],
      },
    });


    if (conversation) {
      return { conversation, isNew: false }
    }


    conversation = await Conversation.create({
      type: "private",
      participants: [...new Set([userId, receiverId])],
      createdBy: userId,
    });
    return conversation;
  },
  async createGroupConversation(
    userId: string,
    groupName: string,
    participants: string[]
  ) {
    if (participants.length < 2) {
      throw new Error("Group must contain at least 3 members including creator");
    }
    const conversation = await Conversation.create({
      type: "group",
      groupName,
      participants: [...new Set([userId, ...participants])],
      admins: [userId],
      createdBy: userId,
    });

    return { conversation, isNew: true };
  },
  async getUserConversations(userId: string) {
    const result = await Conversation.find({
      participants: userId
    }).populate("participants", "-password").populate("lastMessageAt").sort({ createdAt: -1 })

    if (!result) {
      throw new Error("Conversation not found")
    }
    return result
  },
  async getConversationById(conversationId: string) {
    const messages = await Message.find({ conversation: conversationId })
      .populate("sender", "-password")
      .populate("seenBy", "-password")
      .populate("deletedFor", "-password")
      .populate("replyTo", "-password")
      .populate("reactions", "-password")
    if (!Message) {
      throw new Error("No Message yet")
    }
    return Message

  }





}

