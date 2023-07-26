// Import necessary modules
const express = require('express');
const Docker = require('dockerode');
const cors = require('cors');
const http = require('http');
const { Server } = require('socket.io');
const stream = require('stream');

const docker = new Docker();
const app = express();
const server = http.createServer(app);
const port = 3000;

app.use(cors());

// Set up a new Socket.IO server with CORS enabled for the React app's origin
const io = new Server(server, {
    cors: {
        origin: 'http://localhost:3001',
        methods: ['GET', 'POST']
    }
});

// Define the /start route
app.get('/start', async (req, res) => {
    // Get the Docker container
    const container = docker.getContainer('8cbc8b8cc245');

    // Start the container
    await container.start();

    // Send a response back to the client
    res.send('Server started');
});

// Define the /stop route
app.get('/stop', async (req, res) => {
    // Get the Docker container
    const container = docker.getContainer('8cbc8b8cc245');

    // Stop the container
    await container.stop();

    // Send a response back to the client
    res.send('Server stopped');
});

// Define the /status route
app.get('/status', async (req, res) => {
    // Get the Docker container
    const container = docker.getContainer('8cbc8b8cc245');

    // Inspect the container to get its current state
    const data = await container.inspect();

    // Send a response back to the client with the current status of the server
    res.json({ status: data.State.Running ? "Running" : "Stopped" });
});

// Listen for connections from clients
io.on('connection', (socket) => {
    console.log('a user connected');

    const container = docker.getContainer('8cbc8b8cc245');
    const logStream = new stream.PassThrough();

    logStream.on('data', (chunk) => {
        socket.emit('logs', chunk.toString('utf8'));
    });

    container.logs({
        follow: true,
        stdout: true,
        stderr: true,
        timestamps: true
    }, (err, stream) => {
        if (err) {
            console.error(err);
            socket.emit('logs', 'An error occurred while fetching the logs.');
            return;
        }

        container.modem.demuxStream(stream, logStream, logStream);
        stream.on('end', () => {
            logStream.end('!stop!');
        });
    });

    socket.on('disconnect', () => {
        console.log('user disconnected');
    });

    socket.on('error', (err) => {
        console.log('Socket error:', err);
    });
});

// Start the server and listen for requests on the specified port
server.listen(port, () => {
    console.log(`Server running at http://localhost:${port}/`);
});
