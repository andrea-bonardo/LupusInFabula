let currentRoom = null;
let participants = [];
const socket = new WebSocket('ws://localhost:8080');

socket.onmessage = function(event) {
    const data = JSON.parse(event.data);
    if (data.type === 'updateParticipants') {
        participants = data.participants;
        updateParticipants();
    }
};

function joinRoom() {
    const username = document.getElementById('username').value;
    const roomCode = document.getElementById('roomCode').value;

    if (!username || !roomCode) {
        alert("Inserisci un nome e un codice stanza.");
        return;
    }

    currentRoom = roomCode;
    socket.send(JSON.stringify({ type: 'join', room: roomCode, username: username }));

    document.getElementById('login').style.display = 'none';
    document.getElementById('room').style.display = 'block';
    document.getElementById('roomTitle').textContent = currentRoom;
}

function updateParticipants() {
    const participantsList = document.getElementById('participantsList');
    participantsList.innerHTML = ''; // Svuota la lista

    participants.forEach(participant => {
        const listItem = document.createElement('li');
        listItem.textContent = participant;
        participantsList.appendChild(listItem);
    });
}

function leaveRoom() {
    const username = document.getElementById('username').value;

    socket.send(JSON.stringify({ type: 'leave', room: currentRoom, username: username }));

    document.getElementById('login').style.display = 'block';
    document.getElementById('room').style.display = 'none';
    document.getElementById('username').value = '';
    document.getElementById('roomCode').value = '';
    currentRoom = null;
    participants = [];
    updateParticipants();
}
