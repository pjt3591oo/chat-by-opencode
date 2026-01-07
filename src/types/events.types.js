const SocketEvents = {
  CONNECTION: 'connection',
  DISCONNECT: 'disconnect',
  
  JOIN: 'join',
  USER_JOINED: 'userJoined',
  USER_LEFT: 'userLeft',
  USER_LIST: 'userList',
  
  CREATE_ROOM: 'createRoom',
  JOIN_ROOM: 'joinRoom',
  ROOM_LIST: 'roomList',
  ROOM_CREATED: 'roomCreated',
  CURRENT_ROOM: 'currentRoom',
  
  CHAT_MESSAGE: 'chatMessage',
  FILE_MESSAGE: 'fileMessage',
  MESSAGE: 'message',
  SYSTEM_MESSAGE: 'systemMessage',
  
  MARK_AS_READ: 'markAsRead',
  READ_COUNT_UPDATE: 'readCountUpdate',
  MESSAGE_HISTORY: 'messageHistory',
  
  TYPING: 'typing',
  STOP_TYPING: 'stopTyping',
  USER_TYPING: 'userTyping',
  USER_STOP_TYPING: 'userStopTyping',
  
  ERROR: 'error'
};

const MessageType = {
  TEXT: 'text',
  FILE: 'file',
  SYSTEM: 'system'
};

const ErrorCode = {
  NOT_JOINED: 'NOT_JOINED',
  INVALID_MESSAGE: 'INVALID_MESSAGE',
  INVALID_ROOM: 'INVALID_ROOM',
  INVALID_USERNAME: 'INVALID_USERNAME',
  ROOM_NOT_FOUND: 'ROOM_NOT_FOUND',
  FILE_TOO_LARGE: 'FILE_TOO_LARGE',
  INVALID_FILE_TYPE: 'INVALID_FILE_TYPE'
};

module.exports = { SocketEvents, MessageType, ErrorCode };
