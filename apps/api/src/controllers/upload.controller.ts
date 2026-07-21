import { Request, Response } from "express"
import { UploadService } from "../services/upload.service.js"

export const uploadMedia = async(req:Request,res:Response)=>{
    try {
        const result = await UploadService.uploadFile(req.file!);
        return res.status(200).json({
         data:result,
         success:true
        })
    } catch (error) {
        const message = error instanceof Error ? error?.message : String(error)
        return res.status(500).json({
            message:"Internal server error",
            success:false,
            error:message
        })
    }
}