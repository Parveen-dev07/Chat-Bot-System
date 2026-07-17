import api from "./axios"



export const UserRegister = async(formData:object)=>{
    const response = await api.post(`/user/user-register`,formData);
    return response.data
}
export const UserLogin = async(formData:any)=>{
const response = await api.post(`/user/user-login`,formData);
return response.data
}

export const GetUsers = async(page:number,limit:number)=>{
    const response = await api.get(`/user/get-users?page=${page}&limit=${limit}`);
    return response.data
}