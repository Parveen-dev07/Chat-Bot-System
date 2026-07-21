import {io} from "socket.io-client";
import { getToken } from "../utils/auth";

export const socket = io(import.meta.env.VITE_SOCKET_URL,{
    

    autoConnect:false,
    auth:{
       token:getToken()

    }
    
})