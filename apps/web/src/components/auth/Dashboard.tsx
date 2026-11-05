import { useState } from "react";
import SideBar from "../chat/SideBar";
import ChatList from "../chat/ChatList";
import ChatWindow from "../chat/ChatWindow";
import "./dashboard.css";

const Dashboard = () => {
  const [chatListOpen, setChatListOpen] = useState(true);

  return (
    <div className="dash-layout">
      <SideBar
        chatListOpen={chatListOpen}
        onChatListOpenChange={setChatListOpen}
      />
      <div
        className={`dash-chat-panel ${chatListOpen ? "dash-chat-panel--open" : ""}`}
      >
        {chatListOpen && <ChatList />}
      </div>
      <ChatWindow />
    </div>
  );
};

export default Dashboard;
