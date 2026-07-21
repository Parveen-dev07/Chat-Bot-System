import { useDispatch, useSelector } from "react-redux";
import { logout, getUser } from "../../features/auth/authSlice";
import type { AppDispatch } from "../../app/store";
import { useNavigate } from "react-router-dom";

const SideBar = () => {
  const dispatch = useDispatch<AppDispatch>();
  const user = useSelector(getUser);
  console.log("sho wuss form sidebar 0list --->",user);
  const navigate = useNavigate()
  
  

  return (
    <div style={s.sidebar}>
      <div style={s.brand}>💬 ChatApp</div>

      <div style={s.spacer} />

      <div style={s.userRow}>
        <div style={s.avatar}>{user?.name?.[0]?.toUpperCase() ?? "U"}</div>
        <div style={s.userInfo}>
          <span style={s.userName}>{user?.name ?? "User"}</span>
          <span style={s.userEmail}>{user?.email ?? ""}</span>
        </div>
        <button style={s.logoutBtn} onClick={() => 
        {
           
          dispatch(logout())
          navigate("/login", {replace:true})
          
        }

          } title="Logout">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
            <polyline points="16 17 21 12 16 7" />
            <line x1="21" y1="12" x2="9" y2="12" />
          </svg>
        </button>
      </div>
    </div>
  );
};

const s: Record<string, React.CSSProperties> = {
  sidebar: {
    width: "100px",
    borderRight: "1px solid var(--border)",
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    padding: "16px 0",
    background: "var(--bg)",
  },
  brand: {
    fontSize: "22px",
  },
  spacer: { flex: 1 },
  userRow: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    gap: "8px",
  },
  avatar: {
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
  },
  userInfo: { display: "none" },
  userName: {},
  userEmail: {},
  logoutBtn: {
    background: "none",
    border: "none",
    cursor: "pointer",
    color: "var(--text)",
    padding: "4px",
    borderRadius: "6px",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
  },
};

export default SideBar;
