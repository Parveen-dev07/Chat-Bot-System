import app from "./app.js";
import dotenv from "dotenv";
import { ConnectDb } from "./config/db.js";
import { initSocket } from "./sockets/socket.js";
import http from "http"
const server = http.createServer(app)

const PORT = process.env.PORT || 5000;
dotenv.config();
const startServer = async () => {
  await ConnectDb();

  initSocket(server);

  server.listen(PORT, () => {
    console.log(` Server running at http://localhost:${PORT}`);
  });
};
startServer()

