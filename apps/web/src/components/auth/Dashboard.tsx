import SideBar from "../chat/SideBar";
import ChatList from "../chat/ChatList";
import ChatWindow from "../chat/ChatWindow";

const Dashboard = () => {
  return (
    <div style={s.layout}>
      <SideBar />
      <ChatList />
      <ChatWindow />
    </div>
  );
};

const s: Record<string, React.CSSProperties> = {
  layout: {
    display: "flex",
    height: "100svh",
    overflow: "hidden",
    background: "var(--bg)",
  },
};

export default Dashboard;
