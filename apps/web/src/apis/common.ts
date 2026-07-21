import api from "./axios"

export const uploadImage = async(formData:FormData)=>{
    try {
        const response = await api.post(`/uplaod-media`,formData) 
        return response
    } catch (error:any) {
        throw new Error(error?.response.data.message || 'failed to upload file')
    }
}