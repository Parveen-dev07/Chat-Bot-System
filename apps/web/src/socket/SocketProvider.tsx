import { createContext, useEffect } from "react";
import { socket } from "./socket";
import { useDispatch } from "react-redux";
import type { AppDispatch } from "../app/store";
import { addMessage } from "../features/chat/chatSlice";

export const SocketContext  = createContext(socket);

interface Props {
    children:React.ReactNode
}

const SocketProvider = ({children}:Props)=>{
    const dispatch = useDispatch<AppDispatch>()
    useEffect(()=>{
        socket.connect()
        socket.on("connect",()=>{
            console.log("socket connected Id:",socket.id);
            
        })
        socket.on("receive-message",(message)=>{
            console.log("show reciver socket---->",message);
            
            dispatch(addMessage(message))
        })
        socket.on("disconnect", () => {
      console.log("Disconnected");
    });
        return ()=>{
             socket.off("connect");
            socket.off("disconnect");
            socket.disconnect()
           
        }
    },[])

    return (
        <SocketContext.Provider value={socket}>
            {children}

        </SocketContext.Provider>
    )
}

export default SocketProvider