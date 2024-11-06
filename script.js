// script.js
let currentRoom = null;
let participants = [];

function joinRoom() {
    const username = document.getElementById('username').value;
    const roomCode = document.getElementById('roomCode').value;

    if (!username || !roomCode) {
        alert("Inserisci un nome e un codice stanza.");
        return;
    }

    // Simula la creazione o l'unione a una stanza
    currentRoom = roomCode;
    participants.push(username);

    // Aggiorna la UI
    document.getElementById('login').style.display = 'none';
    document.getElementById('room').style.display = 'block';
    document.getElementById('roomTitle').textContent = currentRoom;
    updateParticipants();
}

function updateParticipants() {
    const participantsList = document.getElementById('participantsList');
    participantsList.innerHTML = ''; // Svuota la lista

    // Aggiungi i partecipanti alla lista
    participants.forEach(participant => {
        const listItem = document.createElement('li');
        listItem.textContent = participant;
        participantsList.appendChild(listItem);
    });
}

function leaveRoom() {
    const username = document.getElementById('username').value;
    
    // Rimuovi l'utente dalla lista dei partecipanti
    participants = participants.filter(participant => participant !== username);

    // Aggiorna la UI
    document.getElementById('login').style.display = 'block';
    document.getElementById('room').style.display = 'none';
    document.getElementById('username').value = '';
    document.getElementById('roomCode').value = '';
    currentRoom = null;
    updateParticipants();
}
