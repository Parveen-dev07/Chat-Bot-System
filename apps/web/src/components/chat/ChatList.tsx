import { useEffect, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  getChatList,
  getChatListState,
  getChatLoading,
  setActiveConversation,
  getActiveConversation,
  getUnreadCounts,
} from "../../features/chat/chatSlice";
import type { AppDispatch } from "../../app/store";
import { getAuthUser } from "../../utils/auth";
import UserList from "./UserList";
import "./chat-list.css";

const ChatList = () => {
  const dispatch = useDispatch<AppDispatch>();
  const chatList = useSelector(getChatListState);
  const loading = useSelector(getChatLoading);
  const activeConversation = useSelector(getActiveConversation);
  const unreadCounts = useSelector(getUnreadCounts);
  const currentUser = getAuthUser();

  const [menuOpen, setMenuOpen] = useState(false);
  const [newChat, setNewChat] = useState(false);
  const [newGroup, setNewGroup] = useState(false);
  const [chatType] = useState("");
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    dispatch(getChatList(chatType));
  }, [dispatch, chatType]);

  useEffect(() => {
    const onDocClick = (e: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        setMenuOpen(false);
      }
    };
    if (menuOpen) document.addEventListener("mousedown", onDocClick);
    return () => document.removeEventListener("mousedown", onDocClick);
  }, [menuOpen]);

  const getName = (conv: any) => {
    if (conv.groupName) return conv.groupName ?? "Group";
    const other = conv.participants?.find(
      (p: any) => p._id !== currentUser?._id
    );
    return other?.name ?? "Unknown";
  };

  const getInitial = (conv: any) => getName(conv)?.[0]?.toUpperCase() ?? "?";

  const openNewChat = () => {
    setNewChat(true);
    setNewGroup(false);
    setMenuOpen(false);
  };

  const openNewGroup = () => {
    setNewGroup(true);
    setNewChat(false);
    setMenuOpen(false);
  };

  return (
    <div className="chat-list">
      <div className="chat-list__header">
        <div>
          <h2 className="chat-list__title">Messages</h2>
          <p className="chat-list__subtitle">
            {chatList.length} conversation{chatList.length === 1 ? "" : "s"}
          </p>
        </div>
        <div className="chat-list__actions" ref={menuRef}>
          <button
            type="button"
            className="chat-list__compose-btn"
            onClick={() => setMenuOpen((p) => !p)}
            aria-expanded={menuOpen}
            title="New conversation"
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <line x1="12" y1="5" x2="12" y2="19" />
              <line x1="5" y1="12" x2="19" y2="12" />
            </svg>
          </button>
          {menuOpen && (
            <div className="chat-list__menu">
              <button type="button" className="chat-list__menu-item" onClick={openNewChat}>
                <span className="chat-list__menu-icon">💬</span>
                <span>
                  <strong>New chat</strong>
                  <small>Message someone</small>
                </span>
              </button>
              <button type="button" className="chat-list__menu-item" onClick={openNewGroup}>
                <span className="chat-list__menu-icon">👥</span>
                <span>
                  <strong>New group</strong>
                  <small>Create a group chat</small>
                </span>
              </button>
            </div>
          )}
        </div>
      </div>

      {loading && <p className="chat-list__hint">Loading conversations…</p>}
      {!loading && chatList.length === 0 && (
        <p className="chat-list__hint">
          No chats yet. Tap <strong>+</strong> to start one.
        </p>
      )}

      <div className="chat-list__scroll">
        {chatList.map((conv: any) => {
          const isActive = activeConversation?._id === conv._id;
          const unread = unreadCounts[String(conv._id)] ?? 0;
          return (
            <button
              type="button"
              key={conv._id}
              className={`chat-list__item ${isActive ? "chat-list__item--active" : ""}`}
              onClick={() => dispatch(setActiveConversation(conv))}
            >
              <div className="chat-list__avatar">{getInitial(conv)}</div>
              <div className="chat-list__info">
                <span className="chat-list__name">{getName(conv)}</span>
                <span className="chat-list__preview">
                  {conv.lastMessage?.content ?? "No messages yet"}
                </span>
              </div>
              {unread > 0 && !isActive && (
                <span className="chat-list__unread" aria-label={`${unread} unread`}>
                  {unread > 99 ? "99+" : unread}
                </span>
              )}
            </button>
          );
        })}
      </div>

      <UserList createType="private" isOpen={newChat} onClose={() => setNewChat(false)} />
      <UserList createType="group" isOpen={newGroup} onClose={() => setNewGroup(false)} />
    </div>
  );
};

export default ChatList;
