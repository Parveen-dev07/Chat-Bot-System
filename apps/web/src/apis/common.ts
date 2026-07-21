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

