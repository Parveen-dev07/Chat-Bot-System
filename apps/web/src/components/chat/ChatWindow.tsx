import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getActiveConversation, GetMessage, Messages } from "../../features/chat/chatSlice";
import { getUser } from "../../features/auth/authSlice";
import type { AppDispatch, RootState } from "../../app/store";
import { getConversationMessages } from "../../utils/getConversationMessage";
import { useSocket } from "../../socket/useSocket";
import { getAuthUser } from "../../utils/auth";





interface Message {
  _id: string;
  senderId: string;
  content: string;
  createdAt: string;
}

const ChatWindow = () => {
  const activeConversation = useSelector(getActiveConversation);
  const messages = useSelector((state: RootState) =>
  getConversationMessages(
    state,
    activeConversation?._id ?? ""
  )
);
const socket = useSocket()
  const currentUser = getAuthUser();
  const dispatch = useDispatch<AppDispatch>()
  // const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [page, setPage] = useState(1);
  const [limit,setLimit] = useState(20)
  console.log("show active from chat window---->",activeConversation);
  

  const getConvName = () => {
    if (!activeConversation) return "";
    if (activeConversation.isGroup) return activeConversation.groupName ?? "Group";
    const other = activeConversation.participants?.find((p: any) => p._id !== currentUser?._id);
    return other?.name ?? "Unknown";
  };

  const handleSend = () => {
    const text = input.trim();
    if (!text || !activeConversation) return;
  
    console.log("handle send work--->");
    
    socket.emit("send-message",{
      conversation:activeConversation?._id,
      text: input,
    type: "text"
    })
    
    setInput("");
  };

  const handleKey = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const getMessageData = async()=>{
    if(!activeConversation) return

      dispatch(GetMessage({
        conversationId:activeConversation?._id as any,
        page,
        limit
      }))
    
  }

  useEffect(()=>{
    if(!activeConversation) return
    getMessageData()
  },[activeConversation,page,limit,dispatch])

   useEffect(() => {
  if (!activeConversation) return;

  socket.emit("join-conversation", activeConversation._id);

  console.log("Joined room:", activeConversation._id);
}, [activeConversation, socket]);

  if (!activeConversation) {
    return (
      <div style={{ ...s.container, ...s.empty }}>
        <span style={s.emptyIcon}>💬</span>
        <p style={s.emptyText}>Select a conversation to start chatting</p>
      </div>
    );
  }
  
   


  return (
    <div style={s.container}>
      {/* Header */}
      <div style={s.header}>
        <div style={s.headerAvatar}>{getConvName()[0]?.toUpperCase()}</div>
        <span style={s.headerName}>{getConvName()}</span>
      </div>

      {/* Messages */}
      <div style={s.messages}>
        {messages?.length === 0 && (
          <p style={s.hint}>No messages yet. Say hello! 👋</p>   
        )}
        {messages?.map((msg) => {
          const isMine = msg.sender._id === currentUser?._id;
          console.log("show is mine---->",isMine);
          console.log("show msd---->",msg);
          
          
          return (
            <div key={msg._id} style={{ ...s.msgRow, justifyContent: isMine ? "flex-end" : "flex-start" }}>
              <div style={{ ...s.bubble, background: isMine ? "var(--accent)" : "var(--code-bg)", color: isMine ? "#fff" : "var(--text-h)" }}>
                {msg.text}
              </div>
            </div>
          );
        })}
      </div> 

      {/* Input */}
      <div style={s.inputRow}>
        <input
          style={s.input}
          placeholder="Type a message…"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={handleKey}
        />
        <button style={s.sendBtn} onClick={handleSend} disabled={!input.trim()}>
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <line x1="22" y1="2" x2="11" y2="13" />
            <polygon points="22 2 15 22 11 13 2 9 22 2" />
          </svg>
        </button>
      </div>
    </div>
  );
};

const s: Record<string, React.CSSProperties> = {
  container: {
    flex: 1,
    display: "flex",
    flexDirection: "column",
    background: "var(--bg)",
    overflow: "hidden",
  },
  empty: {
    alignItems: "center",
    justifyContent: "center",
    gap: "12px",
  },
  emptyIcon: { fontSize: "40px" },
  emptyText: { fontSize: "14px", color: "var(--text)", margin: 0 },
  header: {
    padding: "14px 20px",
    borderBottom: "1px solid var(--border)",
    display: "flex",
    alignItems: "center",
    gap: "10px",
  },
  headerAvatar: {
    width: "34px",
    height: "34px",
    borderRadius: "50%",
    background: "var(--accent-bg)",
    border: "1px solid var(--accent-border)",
    color: "var(--accent)",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    fontWeight: 600,
    fontSize: "13px",
    flexShrink: 0,
  },
  headerName: {
    fontSize: "15px",
    fontWeight: 600,
    color: "var(--text-h)",
  },
  messages: {
    flex: 1,
    overflowY: "auto",
    padding: "16px 20px",
    display: "flex",
    flexDirection: "column",
    gap: "8px",
  },
  hint: {
    fontSize: "13px",
    color: "var(--text)",
    textAlign: "center",
    margin: "auto",
  },
  msgRow: {
    display: "flex",
  },
  bubble: {
    maxWidth: "65%",
    padding: "8px 14px",
    borderRadius: "16px",
    fontSize: "14px",
    lineHeight: "1.5",
    wordBreak: "break-word",
  },
  inputRow: {
    padding: "12px 16px",
    borderTop: "1px solid var(--border)",
    display: "flex",
    gap: "8px",
    alignItems: "center",
  },
  input: {
    flex: 1,
    padding: "10px 14px",
    borderRadius: "8px",
    border: "1px solid var(--border)",
    background: "var(--bg)",
    color: "var(--text-h)",
    fontSize: "14px",
    outline: "none",
    boxSizing: "border-box",
  },
  sendBtn: {
    width: "38px",
    height: "38px",
    borderRadius: "8px",
    border: "none",
    background: "var(--accent)",
    color: "#fff",
    cursor: "pointer",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    flexShrink: 0,
  },
};

export default ChatWindow;
