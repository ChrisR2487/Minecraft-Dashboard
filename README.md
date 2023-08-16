# Minecraft-Dashboard
Minecraft Dashboard is a web application designed to manage and monitor a Minecraft server running in a Docker container. It provides real-time logs, server status updates, and controls to start, stop, and restart the server.

## Features:
- **Real-time Monitoring:** View logs in real time as they happen on the server.
- **Server Controls:** Start, stop, and restart the server directly from the dashboard.
- **Server Status:** Instantly view the current status of the Minecraft server.
- **Responsive UI:** Built using modern web technologies and Tailwind CSS for a responsive and user-friendly interface.

## Technologies Used:
- **React:** For building the user interface of the dashboard.
- **Node.js and Express:** Powers the backend, handling API requests and server logic.
- **Socket.IO:** For real-time communication between the server and the client.
- **Docker and Docker Compose:** For containerizing the Minecraft server and ensuring easy deployment.
- **Tailwind CSS:** A utility-first CSS framework for rapidly building custom user interfaces.

## Setup and Installation:
### Prerequisites:
- Node.js
- Docker
- Docker Compose

### Steps:
1. Clone the Repository:
```
git clone https://github.com/yourusername/minecraft-dashboard.git
cd minecraft-dashboard
```
2. Install Dependencies:
```
npm install
cd client && npm install
```
3. Start the Backend Server:
```
cd .. # Make sure you're in the root directory
npm start
```
4. Start the React Client:
```
cd client && npm start
```
5. Open your browser and navigate to http://localhost:3001 to view the dashboard.

## API Endpoints:
- **GET /status:** Returns the current status of the Minecraft server.
- **GET /start:** Starts the Minecraft server.
- **GET /stop:** Stops the Minecraft server.
- **GET /restart:** Restarts the Minecraft server.

## Contributing
Pull requests are welcome. For major changes, please open an issue first to discuss what you would like to change.
