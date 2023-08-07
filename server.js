// Import necessary modules
const express = require('express');
const Docker = require('dockerode');
const cors = require('cors');
const http = require('http');
const { Server } = require('socket.io');
const stream = require('stream');
const compose = require('docker-compose');
const path = require('path');

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
app.get('/start', (req, res) => {
    compose.upAll({
        cwd: path.dirname(require.main.filename),
        log: true,
        commandOptions: ['-d', '--force-recreate']
    })
    .then(() => {
        console.log('Successfully started the service.');
        res.status(200).send('Server started successfully.');
    })
    .catch(err => {
        console.error('Failed to start the service.', err);
        res.status(500).send(`Failed to start the server: ${err.message}`);
    });
});

// Define the /stop route
app.get('/stop', (req, res) => {
    compose.down({
        cwd: path.dirname(require.main.filename),
        log: true
    })
    .then(() => {
        console.log('Successfully stopped the service.');
        res.status(200).send('Server stopped successfully.');
    })
    .catch(err => {
        console.error('Failed to stop the service.', err);
        res.status(500).send(`Failed to stop the server: ${err.message}`);
    });
});

// Define the /status route
app.get('/status', async (req, res) => {
    try {
        // Get the status of all services
        const servicesStatus = await compose.ps({ cwd: path.dirname(require.main.filename) });

        // Split the output into lines
        const lines = servicesStatus.out.split('\n');

        // Filter the lines to get the one corresponding to the minecraft service
        const minecraftServiceLine = lines.find(line => line.includes('minecraft-server'));

        if (minecraftServiceLine) {
            // Split the line using two or more spaces as the delimiter
            const columns = minecraftServiceLine.split(/ {2,}/);

            // The status should be the column containing 'Up' or 'Exit'
            const status = columns.find(col => col.startsWith('Up') || col.startsWith('Exit'));

            // Return the status to the client
            res.json({ status: status && status.startsWith('Up') ? 'Running' : 'Stopped' });
        } else {
            // If the service isn't found, indicate that it's not running
            res.json({ status: 'Not Running' });
        }
    } catch (err) {
        console.error('Error fetching service status:', err);
        res.status(500).send('Internal Server Error');
    }
});




// Listen for connections from clients
io.on('connection', async (socket) => {
    console.log('a user connected');

    // Retrieve the status of all services defined in docker-compose.yml
    const servicesStatus = await compose.ps({
        cwd: path.dirname(require.main.filename),
        log: true
    });

    // Find the line in the output that corresponds to the 'minecraft-server' service
    const minecraftServerService = servicesStatus.out.split('\n').find(line => line.includes('minecraft'));

    // If the service isn't found in the output, emit an error message
    if (!minecraftServerService) {
        socket.emit('logs', 'Service not found.');
        return;
    }

    // Extract the container ID from the output for the 'minecraft-server' service
    const containerId = minecraftServerService.split(/\s+/)[0];

    const container = docker.getContainer(containerId);
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
