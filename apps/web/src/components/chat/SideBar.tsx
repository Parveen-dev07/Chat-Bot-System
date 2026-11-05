import { useEffect, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { logout, getUser } from "../../features/auth/authSlice";
import type { AppDispatch } from "../../app/store";
import "./sidebar.css";

interface SideBarProps {
  chatListOpen: boolean;
  onChatListOpenChange: (open: boolean) => void;
}

const SideBar = ({ chatListOpen, onChatListOpenChange }: SideBarProps) => {
  const dispatch = useDispatch<AppDispatch>();
  const user = useSelector(getUser);
  const [profileOpen, setProfileOpen] = useState(false);
  const profileRef = useRef<HTMLDivElement>(null);

  const initial = user?.name?.[0]?.toUpperCase() ?? "U";

  const handleAvatarClick = () => {
    const next = !profileOpen;
    setProfileOpen(next);
    if (next) {
      onChatListOpenChange(false);
    }
  };

  const handleToggleMessages = () => {
    onChatListOpenChange(!chatListOpen);
    setProfileOpen(false);
  };

  useEffect(() => {
    const onDocClick = (e: MouseEvent) => {
      if (
        profileRef.current &&
        !profileRef.current.contains(e.target as Node)
      ) {
        setProfileOpen(false);
      }
    };
    if (profileOpen) {
      document.addEventListener("mousedown", onDocClick);
    }
    return () => document.removeEventListener("mousedown", onDocClick);
  }, [profileOpen]);

  return (
    <aside className="app-sidebar">
      <div className="app-sidebar__brand" title="ChatApp">
        <span className="app-sidebar__logo">
          <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
          </svg>
        </span>
        <span className="app-sidebar__brand-text">Chat</span>
      </div>

      <nav className="app-sidebar__nav">
        <button
          type="button"
          className={`app-sidebar__nav-btn ${chatListOpen ? "app-sidebar__nav-btn--active" : ""}`}
          onClick={handleToggleMessages}
          title="Messages"
        >
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
          </svg>
        </button>
      </nav>

      <div className="app-sidebar__spacer" />

      <div className="app-sidebar__footer" ref={profileRef}>
        {profileOpen && (
          <div className="app-sidebar__profile-pop">
            <div className="app-sidebar__profile-avatar">{initial}</div>
            <div className="app-sidebar__profile-meta">
              <span className="app-sidebar__profile-name">
                {user?.name ?? "User"}
              </span>
              <span className="app-sidebar__profile-email">
                {user?.email ?? ""}
              </span>
            </div>
            <button
              type="button"
              className="app-sidebar__profile-logout"
              onClick={() => dispatch(logout())}
            >
              Sign out
            </button>
          </div>
        )}

        <button
          type="button"
          className={`app-sidebar__avatar-btn ${profileOpen ? "app-sidebar__avatar-btn--active" : ""}`}
          onClick={handleAvatarClick}
          title="Profile"
          aria-expanded={profileOpen}
        >
          {initial}
        </button>

        <button
          type="button"
          className="app-sidebar__logout-icon"
          onClick={() => dispatch(logout())}
          title="Logout"
        >
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
            <polyline points="16 17 21 12 16 7" />
            <line x1="21" y1="12" x2="9" y2="12" />
          </svg>
        </button>
      </div>
    </aside>
  );
};

export default SideBar;
