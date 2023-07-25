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
    // Log when a user connects
    console.log('a user connected');

    // Listen for 'getLogs' events from clients
    socket.on('getLogs', async () => {
        console.log('Received getLogs event');

        // Create a PassThrough stream to collect the logs
        var logStream = new stream.PassThrough();

        // Get the Docker container
        const container = docker.getContainer('8cbc8b8cc245');

        // Listen for data events from the log stream and send the data to the client
        logStream.on('data', (chunk) => {
            console.log('Received log data:', chunk.toString('utf8'));
            socket.emit('logs', chunk.toString('utf8'));
        });

        // Fetch the logs from the container
        container.logs({
            follow: true,
            stdout: true,
            stderr: true,
            timestamps: true
        }, (err, logData) => {
            if (err) {
                console.error(err); // Log the error object to the console
                // Send an error message to the client if fetching the logs fails
                socket.emit('logs', 'An error occurred while fetching the logs.');
                return;
            }

            // Demultiplex the log data into the log stream
            container.modem.demuxStream(logData, logStream, logStream);
            logData.on('end', () => {
                logStream.end('!stop!');
            });

            // logStream.on('data', (chunk) => {
            //     console.log('Log data:', chunk.toString('utf8'));
            //     socket.emit('logs', chunk.toString('utf8'));
            //     console.log('Sent logs');
            // });

        });
    });

    // Log when a user disconnects
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

// Start the server with: node server.js
