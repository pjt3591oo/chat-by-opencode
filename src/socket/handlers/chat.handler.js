const { SocketEvents, MessageType } = require('../../types');
const { generateId, isValidMessage, sanitizeString } = require('../../utils');

function setupChatHandlers(socket, stateManager) {
  socket.on(SocketEvents.CHAT_MESSAGE, (message) => {
    const user = stateManager.getUser(socket.id);
    if (!user) {
      return socket.emit(SocketEvents.ERROR, { code: 'NOT_JOINED' });
    }

    if (!isValidMessage(message)) {
      return socket.emit(SocketEvents.ERROR, { code: 'INVALID_MESSAGE' });
    }

    const sanitized = sanitizeString(message);
    const messageId = generateId();

    const messageData = {
      id: messageId,
      username: user.username,
      message: sanitized,
      timestamp: new Date().toISOString(),
      type: MessageType.TEXT,
      room: user.currentRoom
    };

    stateManager.addMessage(user.currentRoom, messageData);

    stateManager.io.to(user.currentRoom).emit(SocketEvents.MESSAGE, {
      ...messageData,
      readCount: 1
    });
  });

  socket.on(SocketEvents.FILE_MESSAGE, (fileData) => {
    const user = stateManager.getUser(socket.id);
    if (!user) {
      return socket.emit(SocketEvents.ERROR, { code: 'NOT_JOINED' });
    }

    if (!fileData || !fileData.url) {
      return socket.emit(SocketEvents.ERROR, { code: 'INVALID_FILE' });
    }

    const messageId = generateId();

    const messageData = {
      id: messageId,
      username: user.username,
      file: fileData,
      timestamp: new Date().toISOString(),
      type: MessageType.FILE,
      room: user.currentRoom
    };

    stateManager.addMessage(user.currentRoom, messageData);

    stateManager.io.to(user.currentRoom).emit(SocketEvents.MESSAGE, {
      ...messageData,
      readCount: 1
    });
  });

  socket.on(SocketEvents.MARK_AS_READ, ({ messageId, room }) => {
    const user = stateManager.getUser(socket.id);
    if (!user) return;

    const readCount = stateManager.markMessageAsRead(room, messageId, user.username);
    
    if (readCount > 0) {
      stateManager.io.to(room).emit(SocketEvents.READ_COUNT_UPDATE, {
        messageId,
        room,
        readCount
      });
    }
  });
}

module.exports = { setupChatHandlers };
