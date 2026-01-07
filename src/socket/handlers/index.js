const { setupPresenceHandlers } = require('./presence.handler');
const { setupRoomHandlers } = require('./room.handler');
const { setupChatHandlers } = require('./chat.handler');

function setupAllHandlers(socket, stateManager) {
  setupPresenceHandlers(socket, stateManager);
  setupRoomHandlers(socket, stateManager);
  setupChatHandlers(socket, stateManager);
}

module.exports = { setupAllHandlers };
