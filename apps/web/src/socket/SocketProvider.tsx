import { createContext, useEffect } from "react";
import { socket } from "./socket";
import { useDispatch, useSelector } from "react-redux";
import type { AppDispatch } from "../app/store";
import { addMessage, getActiveConversation, updateConversationSeen, updateMessageStatus } from "../features/chat/chatSlice";

export const SocketContext = createContext(socket);

interface Props {
    children: React.ReactNode
}

const SocketProvider = ({ children }: Props) => {
    const dispatch = useDispatch<AppDispatch>()
     const activeConversation = useSelector(getActiveConversation);
    useEffect(() => {
        socket.connect()
        socket.on("connect", () => {
            console.log("socket connected Id:", socket.id);

        })
        socket.on("receive-message", (message) => {
            console.log("show reciver socket---->", message);

            dispatch(addMessage(message))
            socket.emit("message-delivered", {
                conversationId: message.conversation,
                messageId: message._id,
            });
           if (activeConversation?._id === message.conversation) {
    socket.emit("message-seen", {
      messageId: message._id,
    });
  }
            
            
    //         if (activeConversation?._id === message.conversation) {
    //             console.log("show condtion trueTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTT----->");
                
    //     socket.emit("conversation-opened", {
    //         conversationId: message.conversation,
    //     });
    // }
           
                     
        })
        socket.on("message-delivered", ({ conversationId, messageId, status }) => {

            dispatch(
                updateMessageStatus({
                    conversationId,
                    messageId,
                    status,
                })
            );

        });
        socket.on("message-seen",({conversationId,messageId,status})=>{
            console.log("show from seen message---->",conversationId,status);
            
         dispatch(updateConversationSeen({
            conversationId,
            
         }))
        })
        socket.on("disconnect", () => {
            console.log("Disconnected");
        });
        return () => {
            socket.off("connect");
            socket.off("disconnect");
            socket.disconnect()

        }
    }, [activeConversation])

    return (
        <SocketContext.Provider value={socket}>
            {children}

        </SocketContext.Provider>
    )
}

export default SocketProvider