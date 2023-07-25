const io = require('socket.io-client');
const socket = io('http://localhost:3000');

socket.emit('getLogs');

socket.on('logs', (data) => {
    console.log('Received logs:', data);
});
