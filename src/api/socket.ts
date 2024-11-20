import { io } from "socket.io-client";

let currentUser: string = "";
export let connectionStatus: boolean = false;

// Set up a single local socket connection
const socket = io("http://localhost:5000", {
  autoConnect: false,
});

/*
    Connect Function:
    1) If we re-login, we have a different username in
    user-dashboard.tsx which causes us to re-connect
    2) This allows the Flask application to send the
    correct set of data to the correct user
*/
export const connectSocket = (username: string) => {
  if (username !== currentUser) {
    if (socket.connected) {
      socket.disconnect();
    }
    socket.auth = { username: username };
  }
  currentUser = username;
  if (!socket.connected) {
    socket.connect();
  }
};

// Callback to update the status
socket.on("connected", () => {
  connectionStatus = true;
});

// Callback to update the status
socket.on("disconnected", () => {
  connectionStatus = false;
});

// Common access to the socket across all pages
export const getSocket = () => socket;
