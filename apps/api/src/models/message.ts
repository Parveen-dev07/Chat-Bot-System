
import mongoose, { Document, ObjectId, Schema } from "mongoose";



interface IMessage {
    conversation: ObjectId | string;

    sender: ObjectId | string;

    text?: string;

    type: "text" | "image" | "video" | "audio" | "file";

    mediaUrl?: string;

    replyTo?: ObjectId | string;

    reactions?: {
        user: ObjectId | string;
        emoji: string;
    }[];

    seenBy?: ObjectId[] | string;

    deletedFor?: ObjectId[] | string;

    isDeleted?: boolean;

    edited?: boolean;
    status?:string
}


const MessageSchema = new Schema<IMessage>(
  {
    conversation: {
      type: Schema.Types.ObjectId,
      ref: "Conversation",
      required: true,
    },

    sender: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    text: {
      type: String,
    },

    type: {
      type: String,
      enum: ["text", "image", "video", "audio", "file"],
      default: "text",
    },

    mediaUrl: {
      type: String,
    },

    replyTo: {
      type: Schema.Types.ObjectId,
      ref: "Message",
    },

    reactions: [
      {
        user: {
          type: Schema.Types.ObjectId,
          ref: "User",
        },
        emoji: String,
      },
    ],

    seenBy: [
      {
        type: Schema.Types.ObjectId,
        ref: "User",
      },
    ],

    deletedFor: [
      {
        type: Schema.Types.ObjectId,
        ref: "User",
      },
    ],

    isDeleted: {
      type: Boolean,
      default: false,
    },

    edited: {
      type: Boolean,
      default: false,
    },
    status: {
    type: String,
    enum: ["sent", "delivered", "seen"],
    default: "sent",
}
  },
  {
    timestamps: true,
  }
);


export const Message = mongoose.model("Message",MessageSchema)