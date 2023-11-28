
const socket = io('http://localhost:3000');
const messageForm = document.getElementById('send-window'); // Change ID to match your HTML
const messageInput = document.getElementById('message-input');
const messageContainer = document.getElementById('message-container');
const darkModeToggle = document.querySelector('.dark-mode-toggle');
const userNameElement = document.getElementById('user-name'); // Added this line

let userName = prompt('What is your name?');
if (!userName) userName = "Anonymous";

userNameElement.innerText = `User: ${userName}`; // Added this line

function toggleDarkMode() {
  document.body.classList.toggle('dark-mode');
  messageForm.classList.toggle('dark-mode');
  messageInput.classList.toggle('dark-mode-input');
  messageContainer.scrollTop = messageContainer.scrollHeight;
}

appendMessage('You joined');
socket.emit('new-user', userName);

socket.on('chat-message', data => {
  console.log(`Message received: ${data.name}: ${data.message}`);
  appendMessage(`${data.name}: ${data.message}`);
});



socket.on('user-connected', userName => {
  appendMessage(`${userName} joined`);
});

socket.on('user-disconnected', userName => {
  appendMessage(`${userName} disconnected`);
});

messageForm.addEventListener('submit', e => {
  e.preventDefault(); // Prevent form submission from reloading the page
  const message = messageInput.value;
  appendMessage(`You: ${message}`);
  socket.emit('send-chat-message', message);
  messageInput.value = '';
});

function appendMessage(message) {
  const messageElement = document.createElement('div');
  messageElement.innerText = message;
  messageContainer.append(messageElement);

  // Automatically scroll down to the latest message
  messageContainer.scrollTop = messageContainer.scrollHeight;
}

