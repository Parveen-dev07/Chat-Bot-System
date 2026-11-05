import { createContext, useEffect, useRef } from "react";
import { socket } from "./socket";
import { useDispatch, useSelector } from "react-redux";
import type { AppDispatch } from "../app/store";
import {
  addConversationToList,
  addMessage,
  bumpConversation,
  getActiveConversation,
  updateConversationSeen,
  updateMessageStatus,
} from "../features/chat/chatSlice";
import { getTokenState } from "../features/auth/authSlice";
import { getAuthUser } from "../utils/auth";

export const SocketContext = createContext(socket);

interface Props {
  children: React.ReactNode;
}

const getConversationId = (value: unknown): string => {
  if (value == null) return "";
  if (typeof value === "object" && "_id" in (value as object)) {
    return String((value as { _id: unknown })._id);
  }
  return String(value);
};

const getSenderId = (sender: unknown): string => {
  if (sender == null) return "";
  if (typeof sender === "object" && "_id" in (sender as object)) {
    return String((sender as { _id: unknown })._id);
  }
  return String(sender);
};

const messagePreview = (message: { text?: string; type?: string }) => {
  if (message.text?.trim()) {
    return message.text.trim();
  }
  return `[${message.type || "text"}]`;
};

const SocketProvider = ({ children }: Props) => {
  const dispatch = useDispatch<AppDispatch>();
  const token = useSelector(getTokenState);
  const activeConversation = useSelector(getActiveConversation);
  const activeConversationRef = useRef(activeConversation);

  activeConversationRef.current = activeConversation;

  useEffect(() => {
    if (!token) return;

    socket.auth = { token };
    if (!socket.connected) {
      socket.connect();
    }

    const onConnect = () => {
      console.log("socket connected Id:", socket.id);
    };

    const onNewConversation = (conversation: unknown) => {
      dispatch(addConversationToList(conversation));
    };

    const onReceiveMessage = (message: {
      _id: string;
      conversation: unknown;
      sender: unknown;
      text?: string;
      type?: string;
    }) => {
      dispatch(addMessage(message));

      const conversationId = getConversationId(message.conversation);
      const currentUser = getAuthUser();
      const senderId = getSenderId(message.sender);
      const activeId = activeConversationRef.current?._id;
      const isOpen =
        activeId != null && String(activeId) === conversationId;
      const fromOther =
        currentUser?._id && senderId !== String(currentUser._id);

      dispatch(
        bumpConversation({
          conversationId,
          preview: messagePreview(message),
          addUnread: Boolean(fromOther && !isOpen),
        })
      );

      if (!fromOther) {
        return;
      }

      socket.emit("message-delivered", {
        conversationId,
        messageId: message._id,
      });

      if (isOpen) {
        socket.emit("message-seen", { messageId: message._id });
      }
    };

    const onMessageDelivered = (payload: {
      conversationId: string;
      messageId: string;
      status: string;
    }) => {
      dispatch(updateMessageStatus(payload));
    };

    const onMessageSeen = ({
      conversationId,
      messageId,
    }: {
      conversationId: string;
      messageId?: string;
    }) => {
      if (messageId) {
        dispatch(
          updateMessageStatus({
            conversationId,
            messageId,
            status: "seen",
          })
        );
        return;
      }
      dispatch(updateConversationSeen({ conversationId }));
    };

    const onDisconnect = () => {
      console.log("Disconnected");
    };

    const onError = (error: unknown) => {
      console.log("show error sockjet ---->", error);
    };

    socket.on("connect", onConnect);
    socket.on("new-conversation", onNewConversation);
    socket.on("receive-message", onReceiveMessage);
    socket.on("message-delivered", onMessageDelivered);
    socket.on("message-seen", onMessageSeen);
    socket.on("disconnect", onDisconnect);
    socket.on("error-message", onError);

    return () => {
      socket.off("connect", onConnect);
      socket.off("new-conversation", onNewConversation);
      socket.off("receive-message", onReceiveMessage);
      socket.off("message-delivered", onMessageDelivered);
      socket.off("message-seen", onMessageSeen);
      socket.off("disconnect", onDisconnect);
      socket.off("error-message", onError);
    };
  }, [dispatch, token]);

  return (
    <SocketContext.Provider value={socket}>{children}</SocketContext.Provider>
  );
};

export default SocketProvider;
