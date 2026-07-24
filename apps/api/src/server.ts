import app from "./app.js";
import dotenv from "dotenv";
import { ConnectDb } from "./config/db.js";
import { initSocket } from "./sockets/socket.js";
import http from "http"
dotenv.config();
const server = http.createServer(app)



console.log("ENV TEST");
console.log("PORT:", process.env.PORT);
console.log("MONGODB_URI:", process.env.MONGODB_URI);
console.log("DOCKER_MONGODB_URI:", process.env.DOCKER_MONGODB_URI);
console.log("JWT_SECRET:", process.env.JWT_SECRET);

const PORT = process.env.PORT || 5000;
const startServer = async () => {
  await ConnectDb();

  initSocket(server);

  server.listen(PORT, () => {
    console.log(` Server running at http://localhost:${PORT}`);
  });
};
startServer()

