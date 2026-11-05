import { useDispatch, useSelector } from "react-redux";
import { createOrGetConverastion, createGroupConversation } from "../../apis/chat";
import type { AppDispatch } from "../../app/store";
import {
  addConversationToList,
  setActiveConversation,
} from "../../features/chat/chatSlice";
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
  const [selected, setSelected] = useState<User[]>([]);
  const [groupName, setGroupName] = useState("");
  const [groupError, setGroupError] = useState("");
  const minOtherMembers = 2;

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
        const conv =
          response?.result?.conversation ?? response?.result;
        if (conv) {
          dispatch(addConversationToList(conv));
          dispatch(setActiveConversation(conv));
        }
        onClose();
      }
    } catch (error: any) {
      throw new Error(error?.response.data.message);
    }
  };

  const handleCreateGroup = async () => {
    if (!groupName.trim() || selected.length < minOtherMembers) return;
    setGroupError("");
    try {
      const response = await createGroupConversation({
        groupName: groupName.trim(),
        participants: selected.map((u) => u._id),
      });
      if (response.success) {
        const conv = response?.data?.conversation;
        if (conv) {
          dispatch(addConversationToList(conv));
          dispatch(setActiveConversation(conv));
        }
        setSelected([]);
        setGroupName("");
        setGroupError("");
        onClose();
      } else {
        setGroupError(
          response.error ||
            response.message ||
            "Could not create group. Try again."
        );
      }
    } catch (error: any) {
      const data = error?.response?.data;
      setGroupError(
        data?.error ||
          data?.message ||
          "Could not create group. Try again."
      );
    }
  };

  const toggleUser = (user: User) => {
    setGroupError("");
    setSelected((prev) =>
      prev.find((u) => u._id === user._id)
        ? prev.filter((u) => u._id !== user._id)
        : [...prev, user]
    );
  };

  useEffect(() => {
    if (isOpen) {
      fetchUsers();
      setGroupError("");
    }
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
              onChange={(e) => {
                setGroupName(e.target.value);
                setGroupError("");
              }}
            />
            <p className="user-modal-hint">
              Select at least {minOtherMembers} other members (3 people total
              including you).
            </p>
            {groupError && (
              <p className="user-modal-error" role="alert">
                {groupError}
              </p>
            )}
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
            <span className="user-modal-count">
              {selected.length} selected
              {selected.length > 0 && selected.length < minOtherMembers
                ? ` · need ${minOtherMembers - selected.length} more`
                : ""}
            </span>
            <button
              type="button"
              className="user-modal-create"
              disabled={
                selected.length < minOtherMembers || !groupName.trim()
              }
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
