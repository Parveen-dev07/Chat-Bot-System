import mongoose from "mongoose"
import {IUser} from "@repo/types"


const UserSchema = new mongoose.Schema<IUser>({
    name: {
        type: String,
        required: true,
        trim: true,
    },
    email: {
        type: String,
        required: true,
        unique: true,
        lowercase: true,
        trim: true,
    },
    password: {
        type: String,
        required: true,
        select: false,
    },
    avatar: { type: String },
    isOnline: { type: Boolean, default: false },
    lastSeen: { type: Date }
}, { timestamps: true })

export const User = mongoose.model("User", UserSchema)