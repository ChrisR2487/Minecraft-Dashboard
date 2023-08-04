// Import necessary modules
import React, { useState, useRef, useEffect } from 'react';
import axios from 'axios';
import { io } from 'socket.io-client';

function App() {
    // Define a new piece of state to keep track of the server status
    const [status, setStatus] = useState('Loading...');

    // Define a new ref to keep track of the logs
    const logsRef = useRef('');

    // Use the useEffect hook to fetch the server status every 5 seconds
    useEffect(() => {
        const interval = setInterval(async () => {
            // Send a GET request to the /status route
            const response = await axios.get('http://localhost:3000/status');

            // Update the status state with the status received from the server
            setStatus(response.data.status);
        }, 3001);

        // Clean up the interval when the component unmounts
        return () => clearInterval(interval);
    }, []);

    // Use the useEffect hook to connect to the Socket.IO server and fetch the logs
     useEffect(() => {
        // Connect to the Socket.IO server
        const socket = io('http://localhost:3000');

        // Send a 'getLogs' event to the server
        socket.emit('getLogs');

        socket.on('logs', (data) => {
            console.log('Received logs:', data);
            logsRef.current += data;
        });

        // Listen for 'logs' events from the server and append the received data to the logs
        socket.on('logs', (data) => {
            console.log('Received log data:', data);
            logsRef.current += data;
        });

        socket.on('connect_error', (err) => {
            console.log('Connection error:', err);
        });

        socket.on('reconnect_error', (err) => {
            console.log('Reconnection error:', err);
        });

        // Disconnect from the server when the component unmounts
        return () => socket.disconnect();
    }, []);

    // Define the function to start the server
    const startServer = async () => {
        // Send a GET request to the /start route
        await axios.get('http://localhost:3000/start');

        // Display an alert to the user
        alert('Server started');
    };

    // Define the function to stop the server
    const stopServer = async () => {
        // Send a GET request to the /stop route
        await axios.get('http://localhost:3000/stop');

        // Display an alert to the user
        alert('Server stopped');
    };

    const deployContainer = () => {
        const imageName = 'itzg/minecraft-server';
        const environmentVariables = {
          'EULA': 'TRUE',
          // Add any other environment variables here
        };
        axios.post('http://localhost:3000/deploy', { image: imageName, env: environmentVariables })
          .then((response) => {
            console.log(response.data);
          })
          .catch((error) => {
            console.error('Error deploying container:', error);
          });
      };

    // Render the component
    return (
        <div>
            <p>Server Status: {status}</p>

            <button onClick={startServer}>Start Server</button>

            <button onClick={stopServer}>Stop Server</button>

            <button onClick={deployContainer}>Deploy Container</button>

            <h2>Logs</h2>
            <textarea readOnly value={logsRef.current} style={{ width: '100%', height: '200px' }} />
        </div>
    );
}

// Export the component
export default App;

// Start the client with: npm start
