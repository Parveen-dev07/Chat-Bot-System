import api from "./axios"


interface GroupProps {
    groupName:string;
    participants:string[]
}

export const getConversationList = async()=>{
    const response = await api.get(`/conversation/get-converastion-list`);
    return response.data
}

export const createOrGetConverastion = async(receiverId:string)=>{
    const response = await api.post(`/conversation/get-or-create`,{receiverId});
    return response.data
}

export const createGroupConversation = async(data:GroupProps)=>{
    const response = await api.post(`/conversation/create-group`,data);
    return response.data
}

export const getMessages = async(conversationId:string,page:number,limit:number)=>{
    const response = await api.get(`/message/get-message/${conversationId}?page=${page}&limit=${limit}`);
    return response.data 
}
