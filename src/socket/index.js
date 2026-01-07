const { SocketEvents } = require('../types');
const { StateManager } = require('../managers/state.manager');
const { setupAllHandlers } = require('./handlers');

function initializeSocket(io) {
  const stateManager = new StateManager(io);

  io.on(SocketEvents.CONNECTION, (socket) => {
    console.log('User connected:', socket.id);
    setupAllHandlers(socket, stateManager);
  });

  return stateManager;
}

module.exports = { initializeSocket };
