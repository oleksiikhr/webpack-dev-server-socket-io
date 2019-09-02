'use strict'

const io = require('socket.io-client')
const socket = io('localhost:3000')

// Initialization
let ulElement
let statisticsElement

window.addEventListener('load', () => {
  // Get list of files
  ulElement = document.querySelector('ul')

  // Add Statistics
  statisticsElement = createElementFromHTML('<div id="dev"></div>')

  // Add styles
  const styleElement = document.createElement('style')
  styleElement.innerHTML = `
    #dev {
      position: absolute;
      right: 10px;
      top: 10px;
      padding: 10px;
      border-radius: 10px;
      box-shadow: 0 1px 3px rgba(0,0,0,0.12), 0 1px 2px rgba(0,0,0,0.24);
      z-index: 99999;
    }

    #dev > div {
      font-weight: bold;
      text-align: center;
      margin-bottom: 5px;
    }

    #dev > span {
      font-size: .9rem;
    }
  `

  document.body.appendChild(statisticsElement)
  document.body.appendChild(styleElement)
})

socket.on('connect', () => {
  // Events for a specific file/folder
  socket.on('chokidar', (payload) => {
    console.log('socket.chokidar', payload)
    action(payload.evt, payload.path, false)
  })

  // Get a list of all files, previously delete existing
  // elements to avoid duplicates
  socket.on('files', (files) => {
    console.log('socket.files', files)
    clearAllElements()
    files.forEach(filePath => action('add', filePath))
  })

  // Updating statistics
  socket.on('statistics', (payload) => {
    statisticsElement.innerHTML = `
      <div>Statistics</div>
      <span>${formatBytes(payload.freemem)}</span> / <span>${formatBytes(payload.totalmem)}</span>
    `
  })
})

/**
 * @param {string} evt - add, addDir, change, unlink, unlinkDir
 * @param {string} path
 * @param {boolean} appendLast
 */
function action(evt, path, appendLast = true) {
  if (!ulElement) {
    return
  }

  let liElement

  switch (evt) {
  case 'add':
    liElement = createListItemElement(path)
    if (appendLast) {
      ulElement.appendChild(liElement)
    } else {
      ulElement.insertBefore(liElement, ulElement.firstChild)
    }
    break
  case 'unlink':
    liElement = findElementByTextContent(path)
    if (liElement) {
      liElement.remove()
    }
    break
  }
}

/**
 * The list structure is identical to index.ejs
 * @param {string} path
 */
function createListItemElement(path) {
  return createElementFromHTML(`<li>
    <div class="path">${path}</div>
  </li>`)
}

/**
 * Create an element based on text
 * @param {string} htmlString
 * @return {Element}
 */
function createElementFromHTML(htmlString) {
  const div = document.createElement('div')
  div.innerHTML = htmlString.trim()
  return div.firstChild
}

/**
 * Find the element by its contents
 * @param {string} textContent
 * @return {Element|null}
 */
function findElementByTextContent(textContent) {
  const list = document.querySelectorAll('li')

  for (const li of list) {
    if (li.textContent.trim() === textContent) {
      return li
    }
  }

  return null
}

/**
 * Clear the <ul> list
 * @return {void}
 */
function clearAllElements() {
  if (!ulElement) {
    return
  }

  ulElement.innerHTML = ''
}

/**
 * Convert size in bytes to KB, MB, GB
 * @param {number} bytes 
 * @param {number} decimals 
 * @return {number}
 * @see https://stackoverflow.com/a/18650828
 */
function formatBytes(bytes, decimals = 2) {
  if (bytes === 0) {
    return '0 Bytes'
  }

  const k = 1024
  const dm = decimals < 0 ? 0 : decimals
  const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB', 'PB', 'EB', 'ZB', 'YB']

  const i = Math.floor(Math.log(bytes) / Math.log(k))

  return parseFloat((bytes / Math.pow(k, i)).toFixed(dm)) + ' ' + sizes[i]
}
