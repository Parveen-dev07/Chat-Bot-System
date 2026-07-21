import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getActiveConversation, GetMessage, Messages } from "../../features/chat/chatSlice";
import type { AppDispatch, RootState } from "../../app/store";
import { getConversationMessages } from "../../utils/getConversationMessage";
import { useSocket } from "../../socket/useSocket";
import { getAuthUser } from "../../utils/auth";
import { formatMessageTime, groupMessagesByDate } from "../../utils/chatUtils";

const MessageStatus = ({ status }: { status: string }) => {
  const color = status === "seen" ? "#7dd3fc" : "rgba(255,255,255,0.7)";
  if (status === "delivered" || status === "seen") return (
    <svg width="18" height="11" viewBox="0 0 18 11" fill="none" title={status}>
      <polyline points="1,6 4,9 9,3" stroke={color} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
      <polyline points="5,6 8,9 17,1" stroke={color} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
  return (
    <svg width="12" height="11" viewBox="0 0 12 11" fill="none" title="sent">
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
  const [input, setInput] = useState("");
  const [page] = useState(1);
  const [limit] = useState(20);
  const [showMembers, setShowMembers] = useState(false);

  // handles both isGroup boolean and type === "group" string from API
  const isGroup = !!(activeConversation?.isGroup || activeConversation?.type === "group");

  const getConvName = () => {
    if (!activeConversation) return "";
    if (isGroup) return activeConversation.groupName ?? "Group";
    const other = activeConversation.participants?.find((p: any) => p._id !== currentUser?._id);
    return other?.name ?? "Unknown";
  };

  const handleSend = () => {
    const text = input.trim();
    if (!text || !activeConversation) return;
    socket.emit("send-message", {
      conversation: activeConversation._id,
      text: input,
      type: "text",
    });
    setInput("");
  };

  const handleKey = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
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
      <div style={{ ...s.container, ...s.empty }}>
        <span style={s.emptyIcon}>💬</span>
        <p style={s.emptyText}>Select a conversation to start chatting</p>
      </div>
    );
  }

  return (
    <div style={s.container}>

      {/* Header */}
      <div
        style={{ ...s.header, cursor: isGroup ? "pointer" : "default" }}
        onClick={() => isGroup && setShowMembers((p) => !p)}
      >
        <div style={s.headerAvatar}>{getConvName()[0]?.toUpperCase()}</div>
        <div style={s.headerInfo}>
          <span style={s.headerName}>{getConvName()}</span>
          {isGroup && (
            <span style={s.headerSub}>
              {activeConversation.participants?.length ?? 0} members · tap to view
            </span>
          )}
        </div>
      </div>

      {/* Group members panel */}
      {isGroup && showMembers && (
        <div style={s.membersPanel}>
          {activeConversation.participants?.map((p: any) => (
            <div key={p._id} style={s.memberRow}>
              <div style={s.memberAvatar}>{p.name?.[0]?.toUpperCase()}</div>
              <div style={s.memberInfo}>
                <span style={s.memberName}>{p.name}</span>
                <span style={s.memberEmail}>{p.email}</span>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Messages */}
      <div style={s.messages}>
        {messages?.length === 0 && (
          <p style={s.hint}>No messages yet. Say hello! 👋</p>
        )}
        {groupMessagesByDate(messages ?? []).map(({ label, messages: group }) => (
          <div key={label}>
            <div style={s.dateHeader}>
              <span style={s.dateLabel}>{label}</span>
            </div>
            {group.map((msg) => {
              const isMine = msg.sender._id === currentUser?._id;
              return (
                <div key={msg._id} style={{ ...s.msgRow, justifyContent: isMine ? "flex-end" : "flex-start" }}>
                  <div style={{ ...s.bubble, background: isMine ? "var(--accent)" : "var(--code-bg)", color: isMine ? "#fff" : "var(--text-h)" }}>
                    {!isMine && <span style={s.senderName}>{msg?.sender?.name ?? "N/A"}</span>}
                    <span>{msg.text}</span>
                    <div style={s.statusRow}>
                      <span style={s.msgTime}>{formatMessageTime(msg.createdAt)}</span>
                      {isMine && <MessageStatus status={msg.status} />}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        ))}
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
  headerInfo: {
    display: "flex",
    flexDirection: "column",
    gap: "2px",
  },
  headerName: {
    fontSize: "15px",
    fontWeight: 600,
    color: "var(--text-h)",
  },
  headerSub: {
    fontSize: "11px",
    color: "var(--text)",
  },
  membersPanel: {
    borderBottom: "1px solid var(--border)",
    background: "var(--code-bg)",
    maxHeight: "220px",
    overflowY: "auto",
  },
  memberRow: {
    display: "flex",
    alignItems: "center",
    gap: "10px",
    padding: "10px 20px",
    borderBottom: "1px solid var(--border)",
  },
  memberAvatar: {
    width: "30px",
    height: "30px",
    borderRadius: "50%",
    background: "var(--accent-bg)",
    border: "1px solid var(--accent-border)",
    color: "var(--accent)",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    fontWeight: 600,
    fontSize: "12px",
    flexShrink: 0,
  },
  memberInfo: {
    display: "flex",
    flexDirection: "column",
    gap: "1px",
  },
  memberName: {
    fontSize: "13px",
    fontWeight: 500,
    color: "var(--text-h)",
  },
  memberEmail: {
    fontSize: "11px",
    color: "var(--text)",
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
    display: "flex",
    flexDirection: "column",
    gap: "2px",
  },
  senderName: {
    fontSize: "11px",
    fontWeight: 600,
    opacity: 0.7,
  },
  statusRow: {
    display: "flex",
    justifyContent: "flex-end",
    alignItems: "center",
    gap: "4px",
    marginTop: "3px",
  },
  msgTime: {
    fontSize: "10px",
    opacity: 0.6,
    lineHeight: 1,
  },
  dateHeader: {
    display: "flex",
    justifyContent: "center",
    margin: "12px 0 6px",
  },
  dateLabel: {
    fontSize: "11px",
    fontWeight: 500,
    color: "var(--text)",
    background: "var(--code-bg)",
    padding: "3px 10px",
    borderRadius: "20px",
    border: "1px solid var(--border)",
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
