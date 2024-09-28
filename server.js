const express = require('express');
const http = require('http');
const socketIo = require('socket.io');
const cors = require('cors');

const app = express();
const server = http.createServer(app);
const io = socketIo(server, {
    cors: {
        origin: "http://localhost:3000", // Adjust this as needed
        methods: ["GET", "POST"],
        allowedHeaders: ["Content-Type"],
        credentials: true
    }
});

// Enable CORS for Express routes
app.use(cors());

// Middleware to parse JSON bodies
app.use(express.json());

app.get('/', (req, res) => {
    res.sendFile(__dirname + '/index.html');
});

io.on('connection', (socket) => {
    console.log('A user connected');

    socket.on('batteryStatus', (data) => {
        console.log('Battery status:', data);
        io.emit('update', data); // Broadcast to all connected clients
    });
});

app.post('/batteryStatus', (req, res) => {
    console.log('Received battery status:', req.body);
    io.emit('update', req.body); // Emit to all connected clients
    res.sendStatus(200); // Respond with 200 OK
});

server.listen(3000, () => {
    console.log('Server is running on http://localhost:3000');
});
