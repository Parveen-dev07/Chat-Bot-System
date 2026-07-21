import api from "./axios"

export const uploadImage = async(formData:FormData)=>{
    try {
        const response = await api.post(`/upload`, formData, { headers: { "Content-Type": "multipart/form-data" } })
        return response
    } catch (error:any) {
        throw new Error(error?.response.data.message || 'failed to upload file')
    }
}