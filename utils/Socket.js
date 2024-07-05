import { Server } from "socket.io";

let io;

export function initialize() {
  io = new Server();

  io.on("connection", (socket) => {
    console.log("New client connected");

    socket.on("join", ({ userId }) => {
      socket.join(userId);
      console.log(`User with ID: ${userId} joined the room`);
    });

    socket.on("disconnect", () => {
      console.log("Client disconnected");
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
