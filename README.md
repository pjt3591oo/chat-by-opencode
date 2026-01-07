# Nexus Chat v2.0.0
Enter the void. Connect with others.

![Node.js](https://img.shields.io/badge/node.js-6DA55F?style=for-the-badge&logo=node.js&logoColor=white)
![Socket.io](https://img.shields.io/badge/Socket.io-010101?style=for-the-badge&logo=socket.io&logoColor=white)
![Version](https://img.shields.io/badge/version-2.0.0-blue?style=for-the-badge)
![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg?style=for-the-badge)

## Screenshot
![Nexus Chat Interface Placeholder](https://via.placeholder.com/800x450?text=Nexus+Chat+Interface)

## Features
- Real-time messaging via WebSocket
- Group chat rooms (create and join multiple rooms)
- Default rooms: General and Random
- Real-time room switching
- Message history (see previous messages when joining a room)
- File sharing (images, documents, videos up to 10MB)
- File preview and download
- Read receipts (shows how many users read each message)
- Username-based login
- Typing indicators
- Online user list per room
- User join/leave notifications
- Modern dark glassmorphism UI
- Responsive layout
- Input validation and sanitization

## Tech Stack
- Node.js
- Express
- Socket.io
- Multer

## Project Structure
```
nexus-chat/
├── src/
│   ├── index.js           # Entry point
│   ├── server.js          # HTTP + Socket.io bootstrap
│   ├── app.js             # Express factory
│   ├── config/            # Environment configuration
│   ├── types/             # Event constants
│   ├── utils/             # ID generation, validation
│   ├── managers/
│   │   └── state.manager.js  # State management
│   ├── socket/
│   │   ├── index.js       # Socket.io initialization
│   │   └── handlers/      # Event handlers (chat, room, presence)
│   └── http/
│       ├── routes/        # REST endpoints
│       └── middleware/    # Express middleware
├── public/
│   └── index.html         # Frontend SPA
├── uploads/               # Uploaded files
├── server.js              # Legacy entry (deprecated)
└── package.json
```

## Prerequisites
- Node.js (LTS version recommended)
- npm (Node Package Manager)

## Installation
Follow these steps to set up the project locally:

1. Clone the repository:
   ```bash
   git clone https://github.com/yourusername/nexus-chat.git
   ```

2. Navigate to the project directory:
   ```bash
   cd nexus-chat
   ```

3. Install the required dependencies:
   ```bash
   npm install
   ```

4. Start the application:
   ```bash
   npm start
   ```

## Usage
1. Once the server is running, open your web browser and navigate to `http://localhost:3000`.
2. Enter your desired alias in the login screen and click **Join Network**.
3. By default, you will join the **General** room. You can see all available rooms in the sidebar.
4. To create a new room, click the **+** button in the sidebar, enter a name and description, and click **Create Room**.
5. To switch between rooms, click on any room name in the sidebar to join it instantly.
6. To share a file, click the paperclip icon in the message input area, select your file (up to 10MB), and send.
7. Images will display a preview directly in the chat, while other files will appear as downloadable cards.
8. Each message displays a read count (e.g., "Read by 2"), which updates in real-time as other users in the room view the message.
9. When you join a room or switch rooms, you'll automatically see the message history (up to 100 recent messages per room).
10. Open multiple browser tabs to simulate different users chatting across various rooms.

## License
This project is licensed under the MIT License.
