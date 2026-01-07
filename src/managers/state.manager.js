const { SocketEvents } = require('../types');
const { generateId } = require('../utils');

const DEFAULT_ROOM = 'general';
const MAX_MESSAGES_PER_ROOM = 100;

class StateManager {
  constructor(io) {
    this.io = io;
    this.users = new Map();
    this.rooms = new Map();
    this.messages = new Map();
    this.initializeDefaultRooms();
  }

  initializeDefaultRooms() {
    this.rooms.set('general', {
      id: 'general',
      name: 'General',
      description: 'General discussion',
      createdBy: 'system',
      createdAt: new Date()
    });
    this.rooms.set('random', {
      id: 'random',
      name: 'Random',
      description: 'Random talks',
      createdBy: 'system',
      createdAt: new Date()
    });
    this.messages.set('general', []);
    this.messages.set('random', []);
  }

  addUser(socketId, username) {
    const user = {
      socketId,
      username,
      currentRoom: DEFAULT_ROOM,
      joinedAt: new Date()
    };
    this.users.set(socketId, user);
    return user;
  }

  removeUser(socketId) {
    const user = this.users.get(socketId);
    if (user) {
      this.users.delete(socketId);
    }
    return user;
  }

  getUser(socketId) {
    return this.users.get(socketId);
  }

  getUserCount() {
    return this.users.size;
  }

  getUserList() {
    const list = [];
    this.users.forEach((user, id) => {
      list.push({
        id,
        username: user.username,
        currentRoom: user.currentRoom
      });
    });
    return list;
  }

  createRoom(name, description, createdBy) {
    const id = generateId();
    const room = {
      id,
      name,
      description: description || '',
      createdBy,
      createdAt: new Date()
    };
    this.rooms.set(id, room);
    this.messages.set(id, []);
    return room;
  }

  getRoom(roomId) {
    return this.rooms.get(roomId);
  }

  hasRoom(roomId) {
    return this.rooms.has(roomId);
  }

  getRoomList() {
    const list = [];
    this.rooms.forEach((room, id) => {
      const memberCount = this.getRoomMemberCount(id);
      list.push({
        id,
        name: room.name,
        description: room.description,
        createdBy: room.createdBy,
        memberCount
      });
    });
    return list;
  }

  getRoomMemberCount(roomId) {
    let count = 0;
    this.users.forEach(user => {
      if (user.currentRoom === roomId) count++;
    });
    return count;
  }

  moveUserToRoom(socketId, roomId) {
    const user = this.users.get(socketId);
    if (user && this.rooms.has(roomId)) {
      user.currentRoom = roomId;
      return true;
    }
    return false;
  }

  addMessage(roomId, messageData) {
    if (!this.messages.has(roomId)) {
      this.messages.set(roomId, []);
    }
    
    const message = {
      ...messageData,
      readBy: new Set([messageData.username])
    };
    
    const roomMessages = this.messages.get(roomId);
    roomMessages.push(message);
    
    if (roomMessages.length > MAX_MESSAGES_PER_ROOM) {
      roomMessages.shift();
    }
    
    return message;
  }

  getMessage(roomId, messageId) {
    const roomMessages = this.messages.get(roomId);
    if (!roomMessages) return null;
    return roomMessages.find(m => m.id === messageId);
  }

  markMessageAsRead(roomId, messageId, username) {
    const message = this.getMessage(roomId, messageId);
    if (message && !message.readBy.has(username)) {
      message.readBy.add(username);
      return message.readBy.size;
    }
    return message ? message.readBy.size : 0;
  }

  getMessageReadCount(roomId, messageId) {
    const message = this.getMessage(roomId, messageId);
    return message ? message.readBy.size : 0;
  }

  getRoomMessages(roomId) {
    const roomMessages = this.messages.get(roomId);
    if (!roomMessages) return [];
    
    return roomMessages.map(msg => ({
      ...msg,
      readBy: undefined,
      readCount: msg.readBy.size
    }));
  }

  broadcastUserList() {
    this.io.emit(SocketEvents.USER_LIST, this.getUserList());
  }

  broadcastRoomList() {
    this.io.emit(SocketEvents.ROOM_LIST, this.getRoomList());
  }
}

module.exports = { StateManager, DEFAULT_ROOM };
