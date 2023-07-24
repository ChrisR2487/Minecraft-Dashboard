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
    const container = docker.getContainer('1ac82c7fb55a');

    // Start the container
    await container.start();

    // Send a response back to the client
    res.send('Server started');
});

// Define the /stop route
app.get('/stop', async (req, res) => {
    // Get the Docker container
    const container = docker.getContainer('1ac82c7fb55a');

    // Stop the container
    await container.stop();

    // Send a response back to the client
    res.send('Server stopped');
});

// Define the /status route
app.get('/status', async (req, res) => {
    // Get the Docker container
    const container = docker.getContainer('1ac82c7fb55a');

    // Inspect the container to get its current state
    const data = await container.inspect();

    // Send a response back to the client with the current status of the server
    res.json({ status: data.State.Running ? "Running" : "Stopped" });
});

// Start the server and listen for requests on the specified port
app.listen(port, () => {
    console.log(`Server running at http://localhost:${port}/`);
});

// Start the server with: node server.js
