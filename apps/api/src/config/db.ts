import mongoose from "mongoose";

export const ConnectDb = async()=>{
    try {
        await mongoose.connect(process.env.MONGODB_URI as string);
        console.log("DB connection successfully");
        
    } catch (error) {
        console.log('DB connection failed');
        process.exit(1)
    }
}