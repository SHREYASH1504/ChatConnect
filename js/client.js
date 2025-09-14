const socket = io('http://localhost:8000');

const form = document.getElementById('send-container');
const messageInput = document.getElementById('messageInp');
const messageContainer = document.querySelector(".container");
var audio = new Audio('ting.mp3');

const append = (message, position) => {
    const messageElement = document.createElement('div');
    messageElement.innerText = message;
    messageElement.classList.add('message');
    messageElement.classList.add(position);
    messageContainer.append(messageElement);
    if(position == 'left')
    {
        audio.play();
    }
}

form.addEventListener('submit', (e) => {
    e.preventDefault();
    const message = messageInput.value;
    append(`You: ${message}`, 'right');
    socket.emit('send', message);
    messageInput.value = '';
});

// Prompt for user name
const name = prompt("Enter your name to join the chat");
socket.emit('new-user-joined', name);
append(`${name} joined the chat`, "right");

// If a new user joins, receive his name from the server
socket.on('receive', data => {
    append(`${data.name}: ${data.message}`, 'left');
});

// Notify when a user joins
socket.on('user-joined', name => {
    append(`${name} joined the chat`, "right"); 
});

// Notify when a user leaves the chat
socket.on('user-left', name => {
    append(`${name} left the chat`, "left");
});