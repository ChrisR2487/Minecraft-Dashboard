const express = require('express');
const Docker = require('dockerode');
const cors = require('cors');
const docker = new Docker();

const app = express();
const port = 3000;

app.use(cors());

app.get('/start', async (req, res) => {
    const container = docker.getContainer('minecraft-server');
    await container.start();
    res.send('Server started');
});

app.get('/stop', async (req, res) => {
    const container = docker.getContainer('minecraft-server');
    await container.stop();
    res.send('Server stopped');
});

app.listen(port, () => {
    console.log(`Server running at http://localhost:${port}/`);
});
