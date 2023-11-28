// const { append } = require("vary")

const socket = io('http://localhost:8000')
const messageForm = document.getElementById('send-container')
const messageInput = document.getElementById('message-input')
const messageContainer = document.getElementById('message-container')

const name = prompt('What is your name?')
appendMessage('You joined')
socket.emit('new-user', name)

socket.on('chat-message', data => {
  appendMessage('${data.name}: ${data.message}')
})

socket.on('user-connected', name => {
    appendMessage('${name} joined')
})

socket.on('user-disconnected', name => {
appendMessage('${name} disconnected')
})

messageForm.addEventListener('submit', e => {
  e.preventDefault()
  const message = messageInput.value
  appendMessage('You: ${data.message}')
  socket.emit('send-chat-message', message)
  messageInput.value = ''
})

function appendMessage(message) {
  const messageElement = document.createElement('div')
  messageElement.innerText = message
  messageContainer.append(messageElement)
}