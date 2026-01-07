const express = require('express');
const http = require('http');
const { Server } = require('socket.io');
const path = require('path');
const multer = require('multer');
const fs = require('fs');

const app = express();
const server = http.createServer(app);
const io = new Server(server);

const PORT = process.env.PORT || 3000;

const uploadsDir = path.join(__dirname, 'uploads');
if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir, { recursive: true });
}

const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, uploadsDir),
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, uniqueSuffix + path.extname(file.originalname));
  }
});

const upload = multer({
  storage,
  limits: { fileSize: 10 * 1024 * 1024 },
  fileFilter: (req, file, cb) => {
    const allowed = /jpeg|jpg|png|gif|webp|pdf|doc|docx|txt|zip|mp3|mp4/;
    const extOk = allowed.test(path.extname(file.originalname).toLowerCase());
    const mimeOk = file.mimetype.startsWith('image/') || 
                   file.mimetype.startsWith('video/') || 
                   file.mimetype.startsWith('audio/') ||
                   file.mimetype.includes('pdf') ||
                   file.mimetype.includes('document');
    cb(null, extOk || mimeOk);
  }
});

app.use(express.static(path.join(__dirname, 'public')));
app.use('/uploads', express.static(uploadsDir));

app.post('/upload', upload.single('file'), (req, res) => {
  if (!req.file) return res.status(400).json({ error: 'No file uploaded' });
  res.json({
    filename: req.file.filename,
    originalName: req.file.originalname,
    mimetype: req.file.mimetype,
    size: req.file.size,
    url: `/uploads/${req.file.filename}`
  });
});

app.use((err, req, res, next) => {
  if (err instanceof multer.MulterError) {
    return res.status(400).json({ error: err.code === 'LIMIT_FILE_SIZE' ? 'File too large (max 10MB)' : err.message });
  }
  if (err) return res.status(400).json({ error: err.message });
  next();
});

const users = new Map();
const rooms = new Map([
  ['general', { name: 'General', description: 'General discussion', createdBy: 'system' }],
  ['random', { name: 'Random', description: 'Random talks', createdBy: 'system' }]
]);

function generateId() {
  return Date.now().toString(36) + Math.random().toString(36).substr(2, 9);
}

io.on('connection', (socket) => {
  console.log('User connected:', socket.id);

  socket.on('join', (username) => {
    users.set(socket.id, { username, currentRoom: 'general' });
    socket.join('general');
    
    io.emit('userJoined', { username, userCount: users.size });
    io.emit('userList', getUserList());
    socket.emit('roomList', getRoomList());
    socket.emit('currentRoom', { roomId: 'general', room: rooms.get('general') });
    io.to('general').emit('systemMessage', { room: 'general', text: `${username} joined the room` });
  });

  socket.on('createRoom', ({ name, description }) => {
    const roomId = generateId();
    const user = users.get(socket.id);
    if (!user) return;
    
    rooms.set(roomId, { name, description, createdBy: user.username });
    io.emit('roomList', getRoomList());
    socket.emit('roomCreated', { roomId, room: rooms.get(roomId) });
  });

  socket.on('joinRoom', (roomId) => {
    const user = users.get(socket.id);
    if (!user || !rooms.has(roomId)) return;
    
    const oldRoom = user.currentRoom;
    socket.leave(oldRoom);
    io.to(oldRoom).emit('systemMessage', { room: oldRoom, text: `${user.username} left the room` });
    
    user.currentRoom = roomId;
    socket.join(roomId);
    socket.emit('currentRoom', { roomId, room: rooms.get(roomId) });
    io.to(roomId).emit('systemMessage', { room: roomId, text: `${user.username} joined the room` });
    io.emit('userList', getUserList());
  });

  socket.on('chatMessage', (message) => {
    const user = users.get(socket.id);
    if (!user) return;
    
    io.to(user.currentRoom).emit('message', {
      id: generateId(),
      username: user.username,
      message,
      timestamp: new Date().toISOString(),
      type: 'text',
      room: user.currentRoom
    });
  });

  socket.on('fileMessage', (fileData) => {
    const user = users.get(socket.id);
    if (!user) return;
    
    io.to(user.currentRoom).emit('message', {
      id: generateId(),
      username: user.username,
      file: fileData,
      timestamp: new Date().toISOString(),
      type: 'file',
      room: user.currentRoom
    });
  });

  socket.on('typing', () => {
    const user = users.get(socket.id);
    if (user) socket.to(user.currentRoom).emit('userTyping', user.username);
  });

  socket.on('stopTyping', () => {
    const user = users.get(socket.id);
    if (user) socket.to(user.currentRoom).emit('userStopTyping');
  });

  socket.on('disconnect', () => {
    const user = users.get(socket.id);
    if (user) {
      io.to(user.currentRoom).emit('systemMessage', { room: user.currentRoom, text: `${user.username} disconnected` });
      users.delete(socket.id);
      io.emit('userLeft', { username: user.username, userCount: users.size });
      io.emit('userList', getUserList());
    }
  });
});

function getUserList() {
  const list = [];
  users.forEach((user, id) => {
    list.push({ id, username: user.username, currentRoom: user.currentRoom });
  });
  return list;
}

function getRoomList() {
  const list = [];
  rooms.forEach((room, id) => {
    const memberCount = [...users.values()].filter(u => u.currentRoom === id).length;
    list.push({ id, ...room, memberCount });
  });
  return list;
}

server.listen(PORT, () => {
  console.log(`Chat server running on http://localhost:${PORT}`);
});
