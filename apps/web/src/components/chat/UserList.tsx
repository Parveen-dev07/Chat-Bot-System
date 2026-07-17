import { useDispatch, useSelector } from "react-redux";
import { createOrGetConverastion, createGroupConversation } from "../../apis/chat";
import type { AppDispatch } from "../../app/store";
import { getChatList, setActiveConversation } from "../../features/chat/chatSlice";
import { getUsers, getUsersList } from "../../features/auth/authSlice";
import { useEffect, useState } from "react";
import { getAuthUser } from "../../utils/auth";

interface User {
  _id: string;
  name: string;
  email: string;
}


interface Props {
  isOpen: boolean;
  onClose: () => void;
  onSelect?: (user: User) => void;
  createType:'private' | 'group'
}

const UserList = ({ isOpen, onClose, onSelect, createType = 'private' }: Props) => {
  if (!isOpen) return null;

  const dispatch = useDispatch<AppDispatch>();
  const currentUser = getAuthUser();
  const [chatType] = useState("");
  const [selected, setSelected] = useState<User[]>([]);
  const [groupName, setGroupName] = useState("");

  const USERS = useSelector(getUsersList)?.filter((u: any) => u._id !== currentUser?._id);

  const fetchUsers = async () => { dispatch(getUsers({ page: 1, limit: 50 })); };

  const createConversation = async (receiverId: string) => {
    try {
      if (!receiverId) { alert("Please provide receiver Id"); return; }
      const response = await createOrGetConverastion(receiverId);
      if (response.success) {
        dispatch(getChatList(chatType));
        dispatch(setActiveConversation(response?.result?.conversation));
        onClose();
      }
    } catch (error: any) {
      throw new Error(error?.response.data.message);
    }
  };

  const handleCreateGroup = async () => {
    if (!groupName.trim() || selected.length === 0) return;
    try {
      const response = await createGroupConversation({ groupName: groupName.trim(), participants: selected.map((u) => u._id) });
      console.log("show response------>",response);
      
      if (response.success) {
        dispatch(getChatList(chatType));
        dispatch(setActiveConversation(response?.data?.conversation));
        setSelected([]);
        setGroupName("");
        onClose();
      }
    } catch (error: any) {
      throw new Error(error?.response.data.message);
    }
  };

  const toggleUser = (user: User) => {
    setSelected((prev) =>
      prev.find((u) => u._id === user._id)
        ? prev.filter((u) => u._id !== user._id)
        : [...prev, user]
    );
  };

  useEffect(() => { fetchUsers(); }, [dispatch]);

  return (
    <div style={s.overlay} onClick={onClose}>
      <div style={s.panel} onClick={(e) => e.stopPropagation()}>

        <div style={s.header}>
          <span style={s.title}>{createType === "group" ? "New Group" : "New Message"}</span>
          <button style={s.closeBtn} onClick={onClose}>✕</button>
        </div>

        {createType === "group" && (
          <div style={s.groupNameWrap}>
            <input
              style={s.groupNameInput}
              placeholder="Group name…"
              value={groupName}
              onChange={(e) => setGroupName(e.target.value)}
            />
          </div>
        )}

        <div style={s.list}>
          {USERS!.map((user: any) => {
            const isChecked = !!selected.find((u) => u._id === user._id);
            return (
              <div
                key={user._id}
                style={{ ...s.item, background: isChecked ? "var(--accent-bg)" : "transparent" }}
                onClick={() => createType === "private" ? createConversation(user._id) : toggleUser(user)}
              >
                <div style={s.avatar}>{user.name[0].toUpperCase()}</div>
                <div style={s.info}>
                  <span style={s.name}>{user.name}</span>
                  <span style={s.email}>{user.email}</span>
                </div>
                {createType === "group" && (
                  <div style={{ ...s.checkbox, background: isChecked ? "var(--accent)" : "transparent", borderColor: isChecked ? "var(--accent)" : "var(--border)" }}>
                    {isChecked && <span style={s.checkmark}>✓</span>}
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {createType === "group" && (
          <div style={s.footer}>
            <span style={s.selectedCount}>{selected.length} selected</span>
            <button
              style={{ ...s.createBtn, opacity: selected.length === 0 || !groupName.trim() ? 0.5 : 1 }}
              disabled={selected.length === 0 || !groupName.trim()}
              onClick={handleCreateGroup}
            >
              Create Group
            </button>
          </div>
        )}

      </div>
    </div>
  );
};

const s: Record<string, React.CSSProperties> = {
  overlay: {
    position: "fixed",
    inset: 0,
    background: "rgba(0,0,0,0.4)",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    zIndex: 100,
  },
  panel: {
    width: "340px",
    maxHeight: "480px",
    background: "var(--bg)",
    border: "1px solid var(--border)",
    borderRadius: "14px",
    boxShadow: "var(--shadow)",
    display: "flex",
    flexDirection: "column",
    overflow: "hidden",
  },
  header: {
    padding: "16px 20px",
    borderBottom: "1px solid var(--border)",
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
  },
  title: {
    fontSize: "15px",
    fontWeight: 600,
    color: "var(--text-h)",
  },
  closeBtn: {
    background: "none",
    border: "none",
    cursor: "pointer",
    color: "var(--text)",
    fontSize: "14px",
    padding: "2px 6px",
    borderRadius: "6px",
  },
  groupNameWrap: {
    padding: "12px 20px",
    borderBottom: "1px solid var(--border)",
  },
  groupNameInput: {
    width: "100%",
    padding: "8px 12px",
    borderRadius: "8px",
    border: "1px solid var(--border)",
    background: "var(--bg)",
    color: "var(--text-h)",
    fontSize: "14px",
    outline: "none",
    boxSizing: "border-box",
  },
  list: {
    overflowY: "auto",
    flex: 1,
  },
  item: {
    display: "flex",
    alignItems: "center",
    gap: "10px",
    padding: "12px 20px",
    cursor: "pointer",
    transition: "background 0.15s",
  },
  avatar: {
    width: "36px",
    height: "36px",
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
  info: {
    display: "flex",
    flexDirection: "column",
    gap: "2px",
    flex: 1,
  },
  name: {
    fontSize: "14px",
    fontWeight: 500,
    color: "var(--text-h)",
  },
  email: {
    fontSize: "12px",
    color: "var(--text)",
  },
  checkbox: {
    width: "18px",
    height: "18px",
    borderRadius: "50%",
    border: "2px solid",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    flexShrink: 0,
    transition: "all 0.15s",
  },
  checkmark: {
    color: "#fff",
    fontSize: "11px",
    lineHeight: 1,
  },
  footer: {
    padding: "12px 20px",
    borderTop: "1px solid var(--border)",
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
  },
  selectedCount: {
    fontSize: "13px",
    color: "var(--text)",
  },
  createBtn: {
    padding: "8px 16px",
    borderRadius: "8px",
    border: "none",
    background: "var(--accent)",
    color: "#fff",
    fontSize: "13px",
    fontWeight: 600,
    cursor: "pointer",
  },
};

export default UserList;
