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
            const response = await axios.get('http://localhost:3000/status');

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

    const startServer = async () => {
        await axios.get('http://localhost:3000/start');

        alert('Server started');
    };

    const stopServer = async () => {
        await axios.get('http://localhost:3000/stop');

        alert('Server stopped');
    };

    const restartServer = async () => {
        await axios.get('http://localhost:3000/restart');

        alert('Server restarted');
    };

    return (
        <div className="flex flex-col items-center justify-center h-screen bg-gray-100 p-4">
            <p className="text-2xl font-semibold mb-4">Server Status: <span className="font-normal">{status}</span></p>

            <div className="flex space-x-4 mb-8">
                <button onClick={startServer} className="bg-green-500 hover:bg-green-600 text-white font-semibold py-2 px-4 rounded">Start Server</button>

                <button onClick={stopServer} className="bg-red-500 hover:bg-red-600 text-white font-semibold py-2 px-4 rounded">Stop Server</button>

                <button onClick={restartServer} className="bg-blue-500 hover:bg-blue-600 text-white font-semibold py-2 px-4 rounded">Restart Server</button>
            </div>

            <h2 className="text-xl font-semibold mb-4">Logs</h2>
            <textarea readOnly value={logsRef.current} className="w-full h-96 p-4 bg-white rounded shadow" />
        </div>
    );
}

export default App;

// Start the client with: npm run start
