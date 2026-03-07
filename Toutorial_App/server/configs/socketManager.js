import { Server } from "socket.io";
import { User } from "../models/user.model.js";

let io;

// store online users
const onlineUsers = new Map();

export const initSocket = (server) => {

  io = new Server(server, {
    cors: {
      origin: "http://localhost:5173",
      credentials: true,
    },
  });

  io.on("connection", (socket) => {

    // console.log("Socket connected:", socket.id);

   
    socket.on("userOnline", async (userId) => {
      try {

        const user = await User.findById(userId)
          .select("name email role tenantId");

        if (!user) return;

        // console.log("User online:", user.name);

        onlineUsers.set(socket.id, {
          ...user.toObject(),
          socketId: socket.id,
        });
        const users = getOnlineUsers();

  // console.log("Emitting online users:", users);


        // broadcast updated list
        io.emit("onlineUsers", getOnlineUsers());

      } catch (error) {
        console.error("userOnline error:", error);
      }
    });

   
    socket.on("getOnlineUsers", () => {
      // console.log("Emitting online users:", getOnlineUsers());

      socket.emit("onlineUsers", getOnlineUsers());

    });

   
    socket.on("disconnect", () => {

      // console.log("Socket disconnected:", socket.id);

      onlineUsers.delete(socket.id);

      io.emit("onlineUsers", getOnlineUsers());

    });

  });

};


export const getOnlineUsers = () => {
  return Array.from(onlineUsers.values());
};

export const getIO = () => {
  if (!io) {
    throw new Error("Socket.io not initialized");
  }
  return io;
};