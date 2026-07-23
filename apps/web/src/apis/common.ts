import api from "./axios"

export const uploadImage = async(formData:FormData)=>{
    try {
        const response = await api.post(`/upload`, formData, { headers: { "Content-Type": "multipart/form-data" } })
        return response
    } catch (error:any) {
        throw new Error(error?.response.data.message || 'failed to upload file')
    }
}

export const getMembersList = async()=>{
    try {
        return {
            user:{
                name:"parveen",
                name2:"mandeep",
                name3:"sonu"
            }
        }
    } catch (error:any) {
        throw new Error(error?.response?.data?.message || "failed to get members list")
    }
}
export const addGroupMembers = async(chatId:string)=>{
try {    
 return {
    member:{data:"add members successfully"}
 }
} catch (error:any) {
    throw new Error("failed to add member in the group")
}
}

export const addGroupMembersInComminity = async(conversationId:string)=>{
try {    
 return {
    member:{data:"add members in the comminity successfully"}
 }
} catch (error:any) {
    throw new Error("failed to add member in the group")
}
}



