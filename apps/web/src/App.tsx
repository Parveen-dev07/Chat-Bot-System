import { useEffect } from "react";
import AppRoutes from "./routes/AppRoutes";
import { socket } from "./socket/socket";

function App() {
  useEffect(() => {
    socket.connect();
  }, []);

  return <AppRoutes />;
}

export default App;
