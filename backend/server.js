import http from "http";
import app from "./app.js";
import dotenv from "dotenv";
import { connectDB } from "./config/db.js";
import { Server } from "socket.io";
import jwt from "jsonwebtoken";
import mongoose from "mongoose";
import projectModel from "./models/projectModel.js";
import { generateAIResponse } from "./service/ai_service.js";

dotenv.config();

const port = process.env.PORT || 3000;
const server = http.createServer(app);
connectDB();

const io = new Server(server, {
  cors: {
    origin: "*",
  },
});

io.use(async (socket, next) => {
  try {
    let token;

    // Prefer token passed via auth object
    if (socket.handshake.auth?.token) {
      token = socket.handshake.auth.token;
    } else if (socket.handshake.headers?.authorization) {
      const authHeader = socket.handshake.headers.authorization;
      if (authHeader.startsWith("Bearer ")) {
        token = authHeader.split(" ")[1];
      }
    }
    const projectId = socket.handshake.query.projectId;
    if (!mongoose.Types.ObjectId.isValid(projectId)) {
      return next(new Error("Invalid ProjectId"));
    }
    //made a project that is binded uniquely to a project from DB
    socket.project = await projectModel.findById(projectId);

    if (!token) {
      return next(new Error("Authentication Error: Token missing"));
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    if (!decoded) {
      return next(new Error("Authentication Error: Invalid token"));
    }

    socket.user = decoded;
    next();
  } catch (error) {
    next(new Error("Authentication Error: " + error.message));
  }
});

io.on("connection", (socket) => {
  socket.roomId = socket.project._id.toString();
  console.log("Socket IO Connection established");

  socket.join(socket.roomId);

  socket.on("project-message", async (data) => {
    const message = data.message;
    socket.broadcast.to(socket.roomId).emit("project-message", data);
    console.log("message", data);
    const includesAI = message.includes('@ai');

    if(includesAI){
    const prompt = message.replace("@ai","");
    const output = await generateAIResponse(prompt)
    io.to(socket.roomId).emit('project-message',{
      message : output,
      sender : {
        _id  : 'ai',
        name : "AI"
      }

    })
    }

  });

  socket.on("event", (data) => {
    /* … */
  });
  socket.on("disconnect", () => {
    console.log("User disconnected");
    socket.leave(socket.roomId);
  });
});

server.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
