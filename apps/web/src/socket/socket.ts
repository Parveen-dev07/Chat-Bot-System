import {io} from "socket.io-client";
import { getToken } from "../utils/auth";

export const socket = io(import.meta.env.VITE_SOCKET_URL || "http://chat-api-alb-1851760644.eu-north-1.elb.amazonaws.com",{
    

    autoConnect:false,
    auth:{
       token:getToken()

    }
    
})