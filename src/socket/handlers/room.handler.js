const { SocketEvents } = require('../../types');
const { isValidRoomName, sanitizeString } = require('../../utils');

function setupRoomHandlers(socket, stateManager) {
  socket.on(SocketEvents.CREATE_ROOM, ({ name, description }) => {
    const user = stateManager.getUser(socket.id);
    if (!user) {
      return socket.emit(SocketEvents.ERROR, { code: 'NOT_JOINED' });
    }

    if (!isValidRoomName(name)) {
      return socket.emit(SocketEvents.ERROR, { code: 'INVALID_ROOM' });
    }

    const sanitizedName = sanitizeString(name);
    const sanitizedDesc = sanitizeString(description) || '';

    const room = stateManager.createRoom(sanitizedName, sanitizedDesc, user.username);
    stateManager.broadcastRoomList();
    socket.emit(SocketEvents.ROOM_CREATED, { roomId: room.id, room });
  });

  socket.on(SocketEvents.JOIN_ROOM, (roomId) => {
    const user = stateManager.getUser(socket.id);
    if (!user) {
      return socket.emit(SocketEvents.ERROR, { code: 'NOT_JOINED' });
    }

    if (!stateManager.hasRoom(roomId)) {
      return socket.emit(SocketEvents.ERROR, { code: 'ROOM_NOT_FOUND' });
    }

    const oldRoom = user.currentRoom;
    socket.leave(oldRoom);

    stateManager.io.to(oldRoom).emit(SocketEvents.SYSTEM_MESSAGE, {
      room: oldRoom,
      text: `${user.username} left the room`
    });

    stateManager.moveUserToRoom(socket.id, roomId);
    socket.join(roomId);

    socket.emit(SocketEvents.CURRENT_ROOM, {
      roomId,
      room: stateManager.getRoom(roomId)
    });

    const messageHistory = stateManager.getRoomMessages(roomId);
    socket.emit(SocketEvents.MESSAGE_HISTORY, {
      room: roomId,
      messages: messageHistory
    });

    stateManager.io.to(roomId).emit(SocketEvents.SYSTEM_MESSAGE, {
      room: roomId,
      text: `${user.username} joined the room`
    });

    stateManager.broadcastUserList();
  });
}

module.exports = { setupRoomHandlers };
