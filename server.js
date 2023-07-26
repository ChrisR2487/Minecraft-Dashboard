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

const io = new Server(server, {
    cors: {
        origin: 'http://localhost:3001',
        methods: ['GET', 'POST']
    }
});

export async function startServer(container) {
    await container.start();
    return 'Server started';
}

export async function stopServer(container) {
    await container.stop();
    return 'Server stopped';
}

export async function getServerStatus(container) {
    const data = await container.inspect();
    return { status: data.State.Running ? "Running" : "Stopped" };
}

app.get('/start', async (req, res) => {
    const container = docker.getContainer('8cbc8b8cc245');
    const message = await startServer(container);
    res.send(message);
});

app.get('/stop', async (req, res) => {
    const container = docker.getContainer('8cbc8b8cc245');
    const message = await stopServer(container);
    res.send(message);
});

app.get('/status', async (req, res) => {
    const container = docker.getContainer('8cbc8b8cc245');
    const status = await getServerStatus(container);
    res.json(status);
});

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

server.listen(port, () => {
    console.log(`Server running at http://localhost:${port}/`);
});
