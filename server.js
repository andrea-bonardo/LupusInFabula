const WebSocket = require('ws');

const wss = new WebSocket.Server({ port: 8080 });

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
                break;
            case 'leave':
                if (rooms[data.room]) {
                    rooms[data.room] = rooms[data.room].filter(user => user !== data.username);
                    broadcast(data.room, {
                        type: 'updateParticipants',
                        participants: rooms[data.room]
                    });
                }
                break;
        }
    });

    ws.on('close', () => {
        // Handle user disconnection if necessary
    });
});

function broadcast(room, message) {
    wss.clients.forEach(client => {
        if (client.readyState === WebSocket.OPEN) {
            client.send(JSON.stringify(message));
        }
    });
}

console.log('Server WebSocket in ascolto sulla porta 8080');