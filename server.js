// Import necessary modules
const express = require('express');
const Docker = require('dockerode');
const cors = require('cors');
const docker = new Docker();

// Create a new Express application
const app = express();
const port = 3000;

// Use CORS middleware to allow cross-origin requests
app.use(cors());

// Define the /start route
app.get('/start', async (req, res) => {
    // Get the Docker container
    const container = docker.getContainer('minecraft-server');

    // Start the container
    await container.start();

    // Send a response back to the client
    res.send('Server started');
});

// Define the /stop route
app.get('/stop', async (req, res) => {
    // Get the Docker container
    const container = docker.getContainer('minecraft-server');

    // Stop the container
    await container.stop();

    // Send a response back to the client
    res.send('Server stopped');
});

// Start the server and listen for requests on the specified port
app.listen(port, () => {
    console.log(`Server running at http://localhost:${port}/`);
});
