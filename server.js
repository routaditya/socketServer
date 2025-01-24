const express = require('express');
const http = require('http');
const { Server } = require('socket.io');

const app = express();
const server = http.createServer(app);
const io = new Server(server);

const users = {};

io.on('connection', (socket) => {
  console.log('A user connected:', socket.id);

  // Add new user
  users[socket.id] = { x: 0, y: 0, z: 0 };
  io.emit('update-users', users);

  // Handle user position updates
  socket.on('update-position', (position) => {
    users[socket.id] = position;
    io.emit('update-users', users);
  });

  // Handle user disconnection
  socket.on('disconnect', () => {
    console.log('A user disconnected:', socket.id);
    delete users[socket.id];
    io.emit('update-users', users);
  });
});

server.listen(3001, () => {
  console.log('WebSocket server running on port 3001');
});
