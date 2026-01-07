const { SocketEvents } = require('../../types');
const { isValidUsername } = require('../../utils');
const { DEFAULT_ROOM } = require('../../managers/state.manager');

function setupPresenceHandlers(socket, stateManager) {
  socket.on(SocketEvents.JOIN, (username) => {
    if (!isValidUsername(username)) {
      return socket.emit(SocketEvents.ERROR, { code: 'INVALID_USERNAME' });
    }

    const user = stateManager.addUser(socket.id, username.trim());
    socket.join(DEFAULT_ROOM);

    stateManager.io.emit(SocketEvents.USER_JOINED, {
      username: user.username,
      userCount: stateManager.getUserCount()
    });

    stateManager.broadcastUserList();
    socket.emit(SocketEvents.ROOM_LIST, stateManager.getRoomList());
    socket.emit(SocketEvents.CURRENT_ROOM, {
      roomId: DEFAULT_ROOM,
      room: stateManager.getRoom(DEFAULT_ROOM)
    });

    const messageHistory = stateManager.getRoomMessages(DEFAULT_ROOM);
    socket.emit(SocketEvents.MESSAGE_HISTORY, {
      room: DEFAULT_ROOM,
      messages: messageHistory
    });

    stateManager.io.to(DEFAULT_ROOM).emit(SocketEvents.SYSTEM_MESSAGE, {
      room: DEFAULT_ROOM,
      text: `${user.username} joined the room`
    });

    console.log(`${username} joined the chat`);
  });

  socket.on(SocketEvents.TYPING, () => {
    const user = stateManager.getUser(socket.id);
    if (user) {
      socket.to(user.currentRoom).emit(SocketEvents.USER_TYPING, user.username);
    }
  });

  socket.on(SocketEvents.STOP_TYPING, () => {
    const user = stateManager.getUser(socket.id);
    if (user) {
      socket.to(user.currentRoom).emit(SocketEvents.USER_STOP_TYPING);
    }
  });

  socket.on(SocketEvents.DISCONNECT, () => {
    const user = stateManager.removeUser(socket.id);
    if (user) {
      stateManager.io.to(user.currentRoom).emit(SocketEvents.SYSTEM_MESSAGE, {
        room: user.currentRoom,
        text: `${user.username} disconnected`
      });

      stateManager.io.emit(SocketEvents.USER_LEFT, {
        username: user.username,
        userCount: stateManager.getUserCount()
      });

      stateManager.broadcastUserList();
      console.log(`${user.username} left the chat`);
    }
  });
}

module.exports = { setupPresenceHandlers };
