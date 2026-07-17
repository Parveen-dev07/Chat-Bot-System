import mongoose from "mongoose";

interface IConversation {
    type:string;
    participants:mongoose.Types.ObjectId[] | string[];
    groupName?:string;
    groupImage?:string;
    admins:mongoose.Types.ObjectId[];
    createdBy:mongoose.Types.ObjectId;
    lastMessageBy:mongoose.Types.ObjectId;
    lastMessageAt:Date


}

const ConversationSchema = new mongoose.Schema<IConversation>({
type:{
    type:String,enum:["private","group"],required:true
},
participants:[
    {type:mongoose.Types.ObjectId, ref:"User",required:true}
],
groupName:{type:String},
groupImage:{type:String},
admins:[{type:mongoose.Types.ObjectId, ref:"User"}],
createdBy:{type:mongoose.Types.ObjectId, red:'User'},
lastMessageBy:{type:mongoose.Types.ObjectId, ref:"User"},
lastMessageAt:{type:Date}
},{timestamps:true})

export const Conversation = mongoose.model("Conversation",ConversationSchema)