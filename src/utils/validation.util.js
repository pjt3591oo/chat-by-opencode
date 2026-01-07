const USERNAME_MIN_LENGTH = 2;
const USERNAME_MAX_LENGTH = 20;
const MESSAGE_MAX_LENGTH = 2000;
const ROOM_NAME_MAX_LENGTH = 50;

function sanitizeString(str) {
  if (typeof str !== 'string') return null;
  return str.trim();
}

function isValidUsername(username) {
  const sanitized = sanitizeString(username);
  if (!sanitized) return false;
  if (sanitized.length < USERNAME_MIN_LENGTH) return false;
  if (sanitized.length > USERNAME_MAX_LENGTH) return false;
  return true;
}

function isValidMessage(message) {
  const sanitized = sanitizeString(message);
  if (!sanitized) return false;
  if (sanitized.length > MESSAGE_MAX_LENGTH) return false;
  return true;
}

function isValidRoomName(name) {
  const sanitized = sanitizeString(name);
  if (!sanitized) return false;
  if (sanitized.length > ROOM_NAME_MAX_LENGTH) return false;
  return true;
}

module.exports = {
  sanitizeString,
  isValidUsername,
  isValidMessage,
  isValidRoomName
};
