// Import necessary modules
import React, { useState, useEffect } from 'react';
import axios from 'axios';

function App() {
    // Define a new piece of state to keep track of the server status
    const [status, setStatus] = useState('Loading...');

    // Use the useEffect hook to run code when the component mounts
    useEffect(() => {
        // Set up an interval to check the server status every 5 seconds
        const interval = setInterval(async () => {
            // Send a GET request to the /status route
            const response = await axios.get('http://localhost:3000/status');

            // Update the status state with the status received from the server
            setStatus(response.data.status);
        }, 3001);

        // Clean up the interval when the component unmounts
        return () => clearInterval(interval);
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

    // Render the component
    return (
        <div>
            {/* Display the current server status */}
            <p>Server Status: {status}</p>
            {/* When the "Start Server" button is clicked, call the startServer function */}
            <button onClick={startServer}>Start Server</button>

            {/* When the "Stop Server" button is clicked, call the stopServer function */}
            <button onClick={stopServer}>Stop Server</button>
        </div>
    );
}

// Export the component
export default App;

// Start the client with: npm start
