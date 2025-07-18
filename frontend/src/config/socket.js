import socket from "socket.io-client";

let socketinstance = null;

const initializeSocket = (projectId) => {
  const API_BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:8080";
  socketinstance = socket(API_BASE_URL, {
    auth: {
      token: localStorage.getItem("token"),
    },
    query: {
      projectId,
    },
  });

  return socketinstance;
};

const receiveMessage = (eventName, cb) => {
  socketinstance.on(eventName, cb);
};
const sendMessage = (eventName, data) => {
  socketinstance.emit(eventName, data);
};

export { initializeSocket, receiveMessage, sendMessage };
