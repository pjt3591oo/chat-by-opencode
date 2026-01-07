# Nexus Chat v2.0.0

> Enter the void. Connect with others.

[![Node.js](https://img.shields.io/badge/node.js-6DA55F?style=for-the-badge&logo=node.js&logoColor=white)](https://nodejs.org/)
[![Socket.io](https://img.shields.io/badge/Socket.io-010101?style=for-the-badge&logo=socket.io&logoColor=white)](https://socket.io/)
[![Express](https://img.shields.io/badge/Express-000000?style=for-the-badge&logo=express&logoColor=white)](https://expressjs.com/)
[![Version](https://img.shields.io/badge/version-2.0.0-blue?style=for-the-badge)](#)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg?style=for-the-badge)](LICENSE)

A modern real-time chat application with group rooms, file sharing, and read receipts. Built with Node.js, Express, and Socket.io.

## Features

| Feature | Description |
|---------|-------------|
| Real-time Messaging | Instant message delivery via WebSocket |
| Group Chat Rooms | Create and join multiple rooms |
| Message History | See up to 100 previous messages when joining a room |
| File Sharing | Share images, documents, videos (up to 10MB) |
| Read Receipts | See how many users have read each message |
| Typing Indicators | Know when someone is typing |
| Online Users | View who's online in each room |
| Modern UI | Dark glassmorphism design with animations |

## Tech Stack

- **Runtime**: Node.js
- **Framework**: Express.js
- **Real-time**: Socket.io
- **File Upload**: Multer

## Quick Start

```bash
# Clone the repository
git clone https://github.com/pjt3591oo/chat-by-opencode.git

# Navigate to project
cd chat-by-opencode

# Install dependencies
npm install

# Start the server
npm start
```

Open http://localhost:3000 in your browser.

## Project Structure

```
chat-by-opencode/
├── src/
│   ├── index.js              # Entry point
│   ├── server.js             # HTTP + Socket.io bootstrap
│   ├── app.js                # Express factory
│   ├── config/               # Environment configuration
│   ├── types/                # Event constants & types
│   ├── utils/                # ID generation, validation
│   ├── managers/
│   │   └── state.manager.js  # In-memory state management
│   ├── socket/
│   │   ├── index.js          # Socket.io initialization
│   │   └── handlers/         # Event handlers
│   │       ├── chat.handler.js
│   │       ├── room.handler.js
│   │       └── presence.handler.js
│   └── http/
│       ├── routes/           # REST endpoints
│       └── middleware/       # Express middleware
├── public/
│   └── index.html            # Frontend SPA
├── uploads/                  # Uploaded files
└── package.json
```

## Environment Variables

| Variable | Default | Description |
|----------|---------|-------------|
| `PORT` | `3000` | Server port |

## Socket Events

### Client -> Server

| Event | Payload | Description |
|-------|---------|-------------|
| `join` | `username` | Join chat with username |
| `chatMessage` | `message` | Send text message |
| `fileMessage` | `{ url, mimetype, originalName, size }` | Send file message |
| `createRoom` | `{ name, description }` | Create new room |
| `joinRoom` | `roomId` | Switch to room |
| `typing` | - | User started typing |
| `stopTyping` | - | User stopped typing |
| `markAsRead` | `{ messageId, room }` | Mark message as read |

### Server -> Client

| Event | Payload | Description |
|-------|---------|-------------|
| `message` | `{ id, username, message, timestamp, readCount }` | New message |
| `messageHistory` | `{ room, messages[] }` | Room message history |
| `roomList` | `rooms[]` | Available rooms |
| `userList` | `users[]` | Online users |
| `userJoined` | `{ username }` | User joined notification |
| `userLeft` | `{ username }` | User left notification |
| `readCountUpdate` | `{ messageId, readCount }` | Read count changed |

## Usage

1. Open the app and enter your username
2. You'll join the **General** room by default
3. Create rooms with the **+** button in the sidebar
4. Click any room to switch
5. Use the paperclip icon to share files
6. See read counts (eye icon) on each message

## License

MIT
