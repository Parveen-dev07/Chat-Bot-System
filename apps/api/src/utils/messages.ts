import mongoose from "mongoose";
import { ObjectId, Schema } from "mongoose";

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
