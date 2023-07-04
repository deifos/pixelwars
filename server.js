const express = require("express");
const http = require("http");
const socketIO = require("socket.io");

const app = express();
const server = http.createServer(app);
const io = socketIO(server, {
  cors: {
    origin: "http://localhost:3000",
  },
});

let connectedClients = 0;
let clientData = [];
let clients = [];
// Socket.io event handling
io.on("connection", (socket) => {
  connectedClients++;
  clients.push({ id: socket.id, color: "black" });
  console.log(`A client connected, Total ${connectedClients}`);

  //To get the data to a new client
  socket.emit("drawingData", clientData);

  socket.on("draw", (data) => {
    // Process the drawing data
    clientData.push(data);

    // Broadcast the drawing data to all connected clients but the one drawing
    socket.broadcast.emit("draw", data);
  });

  socket.on("colorSelect", (color) => {
    const client = clients.find((client) => client.id === socket.id);
    if (client) {
      client.color = color;
      io.emit("clientList", clients);
    }
  });

  io.emit("clientList", clients);

  // Handle disconnection
  socket.on("disconnect", () => {
    connectedClients--;
    //update the clients list
    clients = clients.filter((client) => client.id !== socket.id);
    io.emit("clientList", clients);
    console.log(`A client disconnected total: ${connectedClients}`);
  });
});

// Start the server
const port = 8080;
server.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
