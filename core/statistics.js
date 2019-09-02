'use strict'

const { sockets } = require('./io')
const os = require('os')

/**
 * @type {number} milliseconds
 */
const SECOND = 1000

/*
 * We send every second an update about memory consumption
 */
setInterval(() => {
  Object.values(sockets).forEach((socket) => {
    socket.emit('statistics', {
      totalmem: os.totalmem(),
      freemem: os.freemem()
    })
  })
}, SECOND)
