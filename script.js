const socket = io('http://localhost:3000');
const messageForm = document.getElementById('send-window');
const messageInput = document.getElementById('message-input');
const messageContainer = document.getElementById('message-container');
const darkModeToggle = document.querySelector('.dark-mode-toggle');
const userNameElement = document.getElementById('user-name');

let userName = prompt('What is your name?');
if (!userName) userName = "Anonymous";

userNameElement.innerText = `Chatting with: Waiting for user...`;

socket.emit('new-user', userName);

socket.on('existing-users', usersList => {
  if (usersList.length > 0) {
    userNameElement.innerText = `Chatting with: ${usersList[0]}`;
  }
});

socket.on('new-user-joined', otherUserName => {
  userNameElement.innerText = `Chatting with: ${otherUserName}`;
});

socket.on('send-chat-message', data => {
  appendMessage(data.message, true, data.sender);
});

socket.on('chat-message', data => {
  appendMessage(data.message, false, data.sender);
});

socket.on('user-connected', userName => {
  appendMessage(`${userName} joined`, false, 'System');
});

socket.on('user-disconnected', userName => {
  appendMessage(`${userName} disconnected`, false, 'System');
});

messageForm.addEventListener('submit', e => {
  e.preventDefault();
  const message = messageInput.value;
  appendMessage(`${message}`, true, userName);
  socket.emit('send-chat-message', { message, sender: userName });
  messageInput.value = '';
});


function appendMessage(message, isSent, sender) {
  const messageElement = document.createElement('div');
  const senderText = isSent ? '' : (sender ? `${sender}: ` : '');

  messageElement.innerText = `${senderText}${message}`;
  messageElement.classList.add('message', isSent ? 'sent' : 'received');

  messageContainer.append(messageElement);

  messageContainer.scrollTop = messageContainer.scrollHeight;
}

// Add an event listener for the 'input' event on the message input field
messageInput.addEventListener('input', function() {
  // Set the height of the input field based on its scrollHeight
  this.style.height = 'auto';
  this.style.height = (this.scrollHeight) + 'px';
});

// Add an event listener for the 'keypress' event to prevent the Enter key from creating a new line
messageInput.addEventListener('keypress', function(e) {
  if (e.key === 'Enter') {
    e.preventDefault();
    // Optionally, add logic to handle sending the message on Enter
    sendMessage();
  }
});

// Function to handle sending the message 
function sendMessage() {
  const message = messageInput.value;
  if (message.trim() !== '') {
    appendMessage(`${message}`, true, '');
    socket.emit('send-chat-message', { message, sender: '' });
    messageInput.value = '';
    // Reset the input field height
    messageInput.style.height = 'auto';
  }
}

function toggleDarkMode() {
  document.body.classList.toggle('dark-mode');
  messageForm.classList.toggle('dark-mode');
  messageInput.classList.toggle('dark-mode-input');
  messageContainer.classList.toggle('dark-mode'); // Add this line to toggle dark mode for the message container
  messageContainer.scrollTop = messageContainer.scrollHeight;
  const menuBar = document.getElementById('menu-bar');
  menuBar.classList.toggle('dark-mode');
}
