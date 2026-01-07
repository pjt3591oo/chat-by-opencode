const http = require('http');
const { Server } = require('socket.io');
const { createApp } = require('./app');
const { initializeSocket } = require('./socket');
const config = require('./config');

function startServer() {
  const app = createApp();
  const server = http.createServer(app);
  const io = new Server(server);

  initializeSocket(io);

  server.listen(config.server.port, () => {
    console.log(`Chat server running on http://localhost:${config.server.port}`);
  });

  return server;
}

module.exports = { startServer };
