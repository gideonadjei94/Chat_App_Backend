import express, { urlencoded } from "express";
import dotenv from "dotenv";
import morgan from "morgan";
import { dbConnection } from "./utils/Db.js";
import errorHandler from "./middlewares/errorHandler.js";
import { Server } from "socket.io";
import routes from "./routes/entry.js";
// import cors from "cors";

dotenv.config();

//for database connectivity
dbConnection();

const io = new Server({
  cors: "http://10.132.62.10:8081",
});
const port = process.env.port || 8080;
const app = express();

// const corsOption = {
//   origin: "http://10.132.62.10:8081",
// };
// app.use(cors(corsOption));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(morgan("dev"));
app.use(errorHandler);
app.use("/api", routes);

let onlineUsers = [];
// Socket.io connection
io.on("connection", (socket) => {
  console.log("a user connected: ", socket.id);

  socket.on("disconnect", () => {
    console.log("user disconnected");
  });

  socket.on("addNewUser", (userId) => {
    onlineUsers.some((user) => user.userId !== userId) &&
      onlineUsers.push({
        userId,
        socketId: socket.id,
      });
  });

  socket.on("chat message", (msg) => {
    console.log("message: " + msg);
    io.emit("chat message", msg); // broadcast message to all clients
  });
});
io.listen(3000);

app.listen(port, () => {
  console.log(`server listening on port ${port}`);
});
