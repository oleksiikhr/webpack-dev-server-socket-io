'use strict'

const path = require('path')
const fs = require('fs')

/**
 * List all files in a directory recursively in
 * a synchronous fashion
 * @param {string} dirPath
 * @return {IterableIterator<String>}
 */
const walkSync = function* (dirPath) {
  const files = fs.readdirSync(dirPath)

  for (const file of files) {
    const pathFile = path.join(dirPath, file)
    const isDirectory = fs.statSync(pathFile).isDirectory()

    if (isDirectory) {
        yield *walkSync(pathFile)
    } else {
        yield pathFile
    }
  }
}

module.exports = {

  /**
   * @type {string}
   */
  publicFolderPath: path.resolve(__dirname, '../public'),

  walkSync
}
