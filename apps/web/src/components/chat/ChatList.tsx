import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getChatList, getChatListState, getChatLoading, setActiveConversation, getActiveConversation } from "../../features/chat/chatSlice";
import { getUser } from "../../features/auth/authSlice";
import type { AppDispatch } from "../../app/store";
import { getAuthUser } from "../../utils/auth";
import UserList from "./UserList";

const ChatList = () => {
  const dispatch = useDispatch<AppDispatch>();
  const chatList = useSelector(getChatListState);
  const loading = useSelector(getChatLoading);
  const activeConversation = useSelector(getActiveConversation);
  // const currentUser = useSelector(getUser);
  const currentUser = getAuthUser()
  // console.log("show user conversation------->",user) 
  const [userOpen, setUsersOpen] = useState(false);
  const [newChat, setNewChat] = useState(false)
   console.log("show active conversation------->",activeConversation) 
  

  useEffect(() => {
    dispatch(getChatList());  
  }, [dispatch]);

  const getName = (conv: any) => {
    if (conv.isGroup) return conv.groupName ?? "Group";
    const other = conv.participants?.find((p: any) => p._id !== currentUser?._id);
    return other?.name ?? "Unknown";
  };

  const getInitial = (conv: any) => getName(conv)?.[0]?.toUpperCase() ?? "?";  

  return (
    <div style={s.container}>
      <div style={s.header}>
        <span style={s.title}>Messages</span><button 
        onClick={()=> setUsersOpen((prev)=> !prev)}
        > +</button>
        {userOpen && (
          <>
          <option onClick={()=> setNewChat(true)}>New Chat</option>
          <option>new Group</option>
          </>
        )}
        
      </div>

      {loading && <p style={s.hint}>Loading…</p>}
      {!loading && chatList.length === 0 && <p style={s.hint}>No conversations yet</p>}

      <div style={s.list}>
        {chatList.map((conv: any) => {
          const isActive = activeConversation?._id === conv._id;
          return (
            <div
              key={conv._id}
              style={{ ...s.item, background: isActive ? "var(--accent-bg)" : "transparent", borderLeft: isActive ? "2px solid var(--accent)" : "2px solid transparent" }}
              onClick={() => dispatch(setActiveConversation(conv))}
            >
              <div style={s.avatar}>{getInitial(conv)}</div>
              <div style={s.info}>
                <span style={s.name}>{getName(conv)}</span>
                <span style={s.last}>{conv.lastMessage?.content ?? "No messages yet"}</span>
              </div>
            </div>
          );
        })}
      </div>
      <UserList
      isOpen={newChat}
      onClose={()=> setNewChat(false)}
      />
    </div>
  );
};

const s: Record<string, React.CSSProperties> = {
  container: {
    width: "280px",
    borderRight: "1px solid var(--border)",
    display: "flex",
    flexDirection: "column",
    background: "var(--bg)",
    overflow: "hidden",
  },
  header: {
    padding: "20px 16px 12px",
    borderBottom: "1px solid var(--border)",
  },
  title: {
    fontSize: "16px",
    fontWeight: 600,
    color: "var(--text-h)",
  },
  list: {
    flex: 1,
    overflowY: "auto",
  },
  item: {
    display: "flex",
    alignItems: "center",
    gap: "10px",
    padding: "12px 16px",
    cursor: "pointer",
    transition: "background 0.15s",
  },
  avatar: {
    width: "38px",
    height: "38px",
    borderRadius: "50%",
    background: "var(--accent-bg)",
    border: "1px solid var(--accent-border)",
    color: "var(--accent)",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    fontWeight: 600,
    fontSize: "14px",
    flexShrink: 0,
  },
  info: {
    display: "flex",
    flexDirection: "column",
    gap: "2px",
    overflow: "hidden",
  },
  name: {
    fontSize: "14px",
    fontWeight: 500,
    color: "var(--text-h)",
    whiteSpace: "nowrap",
    overflow: "hidden",
    textOverflow: "ellipsis",
  },
  last: {
    fontSize: "12px",
    color: "var(--text)",
    whiteSpace: "nowrap",
    overflow: "hidden",
    textOverflow: "ellipsis",
  },
  hint: {
    padding: "16px",
    fontSize: "13px",
    color: "var(--text)",
    margin: 0,
  },
};

export default ChatList;
