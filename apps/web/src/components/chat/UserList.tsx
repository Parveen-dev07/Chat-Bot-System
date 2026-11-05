import { useDispatch, useSelector } from "react-redux";
import { createOrGetConverastion, createGroupConversation } from "../../apis/chat";
import type { AppDispatch } from "../../app/store";
import { getChatList, setActiveConversation } from "../../features/chat/chatSlice";
import { getUsers, getUsersList } from "../../features/auth/authSlice";
import { useEffect, useState } from "react";
import { getAuthUser } from "../../utils/auth";
import "./user-modal.css";

interface User {
  _id: string;
  name: string;
  email: string;
}

interface Props {
  isOpen: boolean;
  onClose: () => void;
  onSelect?: (user: User) => void;
  createType: "private" | "group";
}

const UserList = ({ isOpen, onClose, createType = "private" }: Props) => {
  const dispatch = useDispatch<AppDispatch>();
  const currentUser = getAuthUser();
  const [chatType] = useState("");
  const [selected, setSelected] = useState<User[]>([]);
  const [groupName, setGroupName] = useState("");

  const USERS = useSelector(getUsersList)?.filter(
    (u: User) => u._id !== currentUser?._id
  );

  const fetchUsers = async () => {
    dispatch(getUsers({ page: 1, limit: 50 }));
  };

  const createConversation = async (receiverId: string) => {
    try {
      if (!receiverId) {
        alert("Please provide receiver Id");
        return;
      }
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
      const response = await createGroupConversation({
        groupName: groupName.trim(),
        participants: selected.map((u) => u._id),
      });
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

  useEffect(() => {
    if (isOpen) fetchUsers();
  }, [dispatch, isOpen]);

  if (!isOpen) return null;

  return (
    <div className="user-modal-overlay" onClick={onClose}>
      <div className="user-modal-panel" onClick={(e) => e.stopPropagation()}>
        <div className="user-modal-header">
          <span className="user-modal-title">
            {createType === "group" ? "Create group" : "Start a chat"}
          </span>
          <button type="button" className="user-modal-close" onClick={onClose}>
            ✕
          </button>
        </div>

        {createType === "group" && (
          <div className="user-modal-search-wrap">
            <input
              className="user-modal-group-input"
              placeholder="Group name"
              value={groupName}
              onChange={(e) => setGroupName(e.target.value)}
            />
          </div>
        )}

        <div className="user-modal-list">
          {USERS?.map((user: User) => {
            const isChecked = !!selected.find((u) => u._id === user._id);
            return (
              <button
                type="button"
                key={user._id}
                className={`user-modal-item ${isChecked ? "user-modal-item--selected" : ""}`}
                onClick={() =>
                  createType === "private"
                    ? createConversation(user._id)
                    : toggleUser(user)
                }
              >
                <div className="user-modal-avatar">
                  {user.name[0].toUpperCase()}
                </div>
                <div className="user-modal-info">
                  <span className="user-modal-name">{user.name}</span>
                  <span className="user-modal-email">{user.email}</span>
                </div>
                {createType === "group" && (
                  <div
                    className={`user-modal-check ${isChecked ? "user-modal-check--on" : ""}`}
                  >
                    {isChecked ? "✓" : ""}
                  </div>
                )}
              </button>
            );
          })}
        </div>

        {createType === "group" && (
          <div className="user-modal-footer">
            <span className="user-modal-count">{selected.length} selected</span>
            <button
              type="button"
              className="user-modal-create"
              disabled={selected.length === 0 || !groupName.trim()}
              onClick={handleCreateGroup}
            >
              Create group
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default UserList;
