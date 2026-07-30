import { useEffect, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getActiveConversation, GetMessage } from "../../features/chat/chatSlice";
import type { AppDispatch, RootState } from "../../app/store";
import { getConversationMessages } from "../../utils/getConversationMessage";
import { useSocket } from "../../socket/useSocket";
import { getAuthUser } from "../../utils/auth";
import { formatMessageTime, groupMessagesByDate } from "../../utils/chatUtils";
import { uploadImage } from "../../apis/common";
import { MessageContent } from "./MessageContent";
import "./chat.css";

const MessageStatus = ({ status }: { status: string }) => {
  const color = status === "seen" ? "#7dd3fc" : "rgba(255,255,255,0.7)";
  if (status === "delivered" || status === "seen") return (
    <svg width="18" height="11" viewBox="0 0 18 11" fill="none">
      <polyline points="1,6 4,9 9,3" stroke={color} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
      <polyline points="5,6 8,9 17,1" stroke={color} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
  return (
    <svg width="12" height="11" viewBox="0 0 12 11" fill="none">
      <polyline points="1,6 4,9 11,1" stroke="rgba(255,255,255,0.7)" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
};


const ChatWindow = () => {
  const activeConversation = useSelector(getActiveConversation);
  const messages = useSelector((state: RootState) =>
    getConversationMessages(state, activeConversation?._id ?? "")
  );
  const socket = useSocket();
  const currentUser = getAuthUser();
  const dispatch = useDispatch<AppDispatch>();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [input, setInput] = useState("");
  const [page] = useState(1);
  const [limit] = useState(20);
  const [showMembers, setShowMembers] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [selectedFile, setSelectedFile] = useState<{ file: File; previewUrl: string } | null>(null);

  const isGroup = !!(activeConversation?.isGroup || activeConversation?.type === "group");

  const getConvName = () => {
    if (!activeConversation) return "";
    if (isGroup) return activeConversation.groupName ?? "Group";
    const other = activeConversation.participants?.find((p: any) => p._id !== currentUser?._id);
    return other?.name ?? "Unknown";
  };

  const handleSend = async () => {
  if (!activeConversation) return;

  const text = input.trim();

  
  if (!text && !selectedFile) return;

  try {
    let mediaUrl = "";
    let type = "text";

    
    if (selectedFile) {
      setUploading(true);

      const formData = new FormData();
      formData.append("file", selectedFile.file);

      const res = await uploadImage(formData);

      mediaUrl =
        res?.data?.data?.secure_url ||
        res?.data?.data?.fileName ||
        "";
        console.log("show media response--->",res);
        

      if (!mediaUrl) {
        throw new Error("File URL not found");
      }

      type = selectedFile.file.type;
    }

    socket.emit("send-message", {
      conversation: activeConversation._id,
      text,
      type,
      ...(mediaUrl && { mediaUrl }),
    });

    setInput("");
    setSelectedFile(null);

  } catch (error) {
    console.error("Send message error:", error);
  } finally {
    setUploading(false);
  }
};

  const handleKey = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    console.log("show selecc file---->", file);

    const previewUrl = URL.createObjectURL(file);
    setSelectedFile({ file, previewUrl });
    e.target.value = "";
  };

  useEffect(() => {
    if (!activeConversation) return;
    dispatch(GetMessage({ conversationId: activeConversation._id as any, page, limit }));
  }, [activeConversation, page, limit, dispatch]);

  useEffect(() => {
    if (!activeConversation) return;
    socket.emit("join-conversation", activeConversation._id);
  }, [activeConversation, socket]);

  useEffect(() => {
    if (!activeConversation) return;
    socket.emit("conversation-opened", { conversationId: activeConversation._id });
  }, [activeConversation]);

  if (!activeConversation) {
    return (
      <div className="cw-container cw-empty">
        <span className="cw-empty-icon">💬</span>
        <p className="cw-empty-text">Select a conversation to start chatting</p>
      </div>
    );
  }

  return (
    <div className="cw-container">

      {/* Header */}
      <div
        className="cw-header"
        style={{ cursor: isGroup ? "pointer" : "default" }}
        onClick={() => isGroup && setShowMembers((p) => !p)}
      >
        <div className="cw-header-avatar">{getConvName()[0]?.toUpperCase()}</div>
        <div className="cw-header-info">
          <span className="cw-header-name">{getConvName()}</span>
          {isGroup && (
            <span className="cw-header-sub">
              {activeConversation.participants?.length ?? 0} members · tap to view
            </span>
          )}
        </div>
      </div>

      {/* Group members panel */}
      {isGroup && showMembers && (    
        <div className="cw-members-panel">
          {activeConversation.participants?.map((p: any) => (
            <div key={p._id} className="cw-member-row">
              <div className="cw-member-avatar">{p.name?.[0]?.toUpperCase()}</div>
              <div className="cw-member-info">
                <span className="cw-member-name">{p.name}</span>
                <span className="cw-member-email">{p.email}</span>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Messages */}
      <div className="cw-messages">
        {messages?.length === 0 && (
          <p className="cw-hint">No messages yet. Say hello! 👋</p>
        )}
        {groupMessagesByDate(messages ?? []).map(({ label, messages: group }) => (  
          <div key={label}>
            <div className="cw-date-header">
              <span className="cw-date-label">{label}</span>
            </div>
            {group.map((msg) => {
              const isMine = msg.sender._id === currentUser?._id; 
              return (
                <div key={msg._id} className="cw-msg-row" style={{ justifyContent: isMine ? "flex-end" : "flex-start" }}>
                  <div className={`cw-bubble ${isMine ? "cw-bubble-mine" : "cw-bubble-other"}`}>
                    {!isMine && <span className="cw-sender-name">{msg?.sender?.name ?? "N/A"}</span>}
                    <MessageContent type={msg.type ?? "text"} text={msg.text} mediaUrl={msg?.mediaUrl || ""} />
                    <div className="cw-status-row">
                      <span className="cw-msg-time">{formatMessageTime(msg.createdAt)}</span>
                      {isMine && <MessageStatus status={msg.status} />}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        ))}
      </div>

      {/* Media preview above input */}
      {selectedFile && (
        <div className="cw-media-preview-bar">
          {selectedFile.file.type.startsWith("image/") ? (
            <img src={selectedFile.previewUrl} alt="preview" className="cw-media-thumb" />
          ) : (
            <div className="cw-media-file-icon">📄</div>
          )}
          <span className="cw-media-file-name">{selectedFile.file.name}</span>
          <button className="cw-media-remove" onClick={() => setSelectedFile(null)}>✕</button>
        </div>
      )}

      {/* Input row */}
      <div className="cw-input-row">
        <input ref={fileInputRef} type="file" accept="image/*,video/*,audio/*,application/pdf,.doc,.docx,.xls,.xlsx,.ppt,.pptx,.txt,.csv,.zip" style={{ display: "none" }} onChange={handleFileChange} />
        <button className="cw-attach-btn" onClick={() => fileInputRef.current?.click()} disabled={uploading}>
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M21.44 11.05l-9.19 9.19a6 6 0 0 1-8.49-8.49l9.19-9.19a4 4 0 0 1 5.66 5.66L9.41 17.41a2 2 0 0 1-2.83-2.83l8.49-8.48" />
          </svg>
        </button>
        <input
          className="cw-input"
          placeholder="Type a message…"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={handleKey}
        />
        <button
          className="cw-send-btn"
          onClick={handleSend}
          disabled={(!input.trim() && !selectedFile) || uploading}
        >
          {uploading ? (
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ opacity: 0.6 }}>
              <circle cx="12" cy="12" r="10" />
            </svg>
          ) : (
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <line x1="22" y1="2" x2="11" y2="13" />
              <polygon points="22 2 15 22 11 13 2 9 22 2" />
            </svg>
          )}
        </button>
      </div>
    </div>
  );
};

export default ChatWindow;
