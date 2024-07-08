import { Server } from "socket.io";

let io;
let users = {};
export function initialize() {
  io = new Server();

  io.on("connection", (socket) => {
    console.log("New client connected :D");

    socket.on("disconnect", () => {
      console.log("Client disconnected :(");
      for (const userId in users) {
        if (users[userId] === socket.id) {
          delete users[userId];
          break;
        }
      }
    });

    socket.on("register", (userId) => {
      users[userId] = socket.id;
      console.log(`User ${userId} registered with socket id ${socket.id}`);
    });

    socket.on("chat-message", (data) => {
      //console.log(data);
      const receiverSocketId = users[data.receiverId];
      if (receiverSocketId) {
        io.to(receiverSocketId).emit("getMessage", data);
      }
    });

    //add a message
    // socket.on("sendMessage", (message) => {
    //   io.to(message.receiverId).emit("getMessage", message);
    // });
  });
  io.listen(3000);
}

export function getIo() {
  if (!io) {
    throw new Error("Socket.io not initialized");
  }
  return io;
}
