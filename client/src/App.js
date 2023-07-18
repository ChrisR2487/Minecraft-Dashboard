import React from 'react';
import axios from 'axios';

function App() {
    const startServer = async () => {
        await axios.get('http://localhost:3000/start');
        alert('Server started');
    };

    const stopServer = async () => {
        await axios.get('http://localhost:3000/stop');
        alert('Server stopped');
    };

    return (
        <div>
            <button onClick={startServer}>Start Server</button>
            <button onClick={stopServer}>Stop Server</button>
        </div>
    );
}

export default App;

