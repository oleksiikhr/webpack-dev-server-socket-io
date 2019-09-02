'use strict'

const server = require('http').createServer()
const io = require('socket.io')(server)
const files = require('./files')

/**
 * List all connections
 * @type {string: SocketIO.Socket}
 */
const sockets = {}

io.on('connection', (socket) => {
  // Save the list of all connections to a variable
  sockets[socket.io] = socket

  // After connection - send a list of all files
  socket.emit('files', files())

  // When disconnect, delete the socket with the variable
  socket.on('disconnect', () => {
    delete sockets[socket.id]
  })
})

server.listen(3000)

module.exports = {
  sockets,
  server,
  io
}
