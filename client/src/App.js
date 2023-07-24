// Import necessary modules
import React from 'react';
import axios from 'axios';

function App() {
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
            {/* When the "Start Server" button is clicked, call the startServer function */}
            <button onClick={startServer}>Start Server</button>

            {/* When the "Stop Server" button is clicked, call the stopServer function */}
            <button onClick={stopServer}>Stop Server</button>
        </div>
    );
}

// Export the component
export default App;


