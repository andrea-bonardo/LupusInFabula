const WebSocket = require('ws');

// Change the port and host to bind to all network interfaces
const port = 8080;
const host = '0.0.0.0';
const wss = new WebSocket.Server({ port, host });

wss.on('error', (error) => {
    if (error.code === 'EADDRINUSE') {
        console.error(`Port ${port} is already in use. Please use a different port.`);
        process.exit(1);
    } else {
        throw error;
    }
});

let rooms = {};

wss.on('connection', ws => {
    ws.on('message', message => {
        const data = JSON.parse(message);
        switch (data.type) {
            case 'join':
                if (!rooms[data.room]) {
                    rooms[data.room] = [];
                }
                rooms[data.room].push(data.username);
                broadcast(data.room, {
                    type: 'updateParticipants',
                    participants: rooms[data.room]
                });
                console.log(`Room ${data.room} participants: ${rooms[data.room].join(', ')}`);
                break;
            case 'leave':
                if (rooms[data.room]) {
                    rooms[data.room] = rooms[data.room].filter(user => user !== data.username);
                    broadcast(data.room, {
                        type: 'updateParticipants',
                        participants: rooms[data.room]
                    });
                    console.log(`Room ${data.room} participants: ${rooms[data.room].join(', ')}`);
                }
                break;
            case 'getRooms':
                ws.send(JSON.stringify({
                    type: 'roomsList',
                    rooms: Object.keys(rooms).map(room => ({
                        room,
                        participants: rooms[room]
                    }))
                }));
                break;
        }
    });

    ws.on('close', () => {
        // Handle user disconnection if necessary
    });
});

function broadcast(room, message) {
    wss.clients.forEach(client => {
        if (client.readyState === WebSocket.OPEN && rooms[room].includes(client.username)) {
            client.send(JSON.stringify(message));
        }
    });
}

console.log(`Server WebSocket in ascolto sulla porta ${port}`);