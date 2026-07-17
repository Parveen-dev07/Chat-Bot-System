import { useDispatch, useSelector } from "react-redux";
import { createOrGetConverastion } from "../../apis/chat";
import type { AppDispatch } from "../../app/store";
import { getChatList, setActiveConversation } from "../../features/chat/chatSlice";
import { getUsers, getUsersList } from "../../features/auth/authSlice";
import { useEffect } from "react";
import { getAuthUser } from "../../utils/auth";

interface User {
  _id: string;
  name: string;
  email: string;
}

// const USERS: User[] = [
//   { _id: "1", name: "Alice Johnson", email: "alice@example.com" },
//   { _id: "2", name: "Bob Smith", email: "bob@example.com" },
//   { _id: "3", name: "Carol White", email: "carol@example.com" },
//   { _id: "4", name: "David Brown", email: "david@example.com" },
//   { _id: "5", name: "Eva Martinez", email: "eva@example.com" },
// ];

interface Props {
  isOpen: boolean;
  onClose: () => void;
  onSelect?: (user: User) => void;
}

const UserList = ({ isOpen, onClose, onSelect }: Props) => {
  if (!isOpen) return null;
const dispatch = useDispatch<AppDispatch>()
const currentUser = getAuthUser()

const USERS = useSelector(getUsersList)?.filter((u:any)=> u._id !== currentUser?._id)
console.log("show users---->",USERS);


const fetchUsers = async()=>{
  dispatch(getUsers({page:1,limit:50}))
}
  const createConversation = async(receiverId:string)=>{
    try {
      if(!receiverId){
        alert("Please provide receiver Id")
      }
      const response = await createOrGetConverastion(receiverId)
      console.log("show resposnse---->",response);
      if(response.success){
        dispatch(getChatList())
        dispatch(setActiveConversation(response?.result?.conversation
))
  onClose()
  
      }

      
    } catch (error:any) {
      throw new Error(error?.response.data.message)
    }
  }
  useEffect(()=>{fetchUsers()},[dispatch])

  return (
    <div style={s.overlay} onClick={onClose}>
      <div style={s.panel} onClick={(e) => e.stopPropagation()}>
        <div style={s.header}>
          <span style={s.title}>New Message</span>
          <button style={s.closeBtn} onClick={onClose}>✕</button>
        </div>

        <div style={s.list}>
          {USERS!.map((user:any) => (
            <div key={user._id} style={s.item} 
            // onClick={() => { onSelect?.(user); onClose(); }}
            onClick={()=> createConversation(user?._id)}
            >
              <div style={s.avatar}>{user.name[0].toUpperCase()}</div>
              <div style={s.info}>
                <span style={s.name}>{user.name}</span>
                <span style={s.email}>{user.email}</span>
              </div>
            </div>
          ))}
        </div>
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
};

export default UserList;
