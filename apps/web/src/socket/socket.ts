import {io} from "socket.io-client";
import { getToken } from "../utils/auth";

export const socket = io("http://16.170.166.86:5000",{
    

    autoConnect:false,
    auth:{
       token:getToken()

    }
    
})