const io = require('socket.io')(8000)

const users = {}

io.on('connection', socket => {
  console.log('new user')
  socket.on('new-user', name => {
    users[socket.id] = name
  })    


  socket.emit('chat-message', 'Hello World')
  socket.on('send-chat-message', message => {
    console.log(message)
    socket.broadcast.emit('chat-message', {message: message, name: users[socket.id]})
  })

  socket.on('disconnect', () => {
    socket.broadcast.emit('user-disconnected', users[socket.id])
    delete users[socket.id]
    })

})


