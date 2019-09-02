'use strict'

const fn = require('./fn')

/**
 * List of files in a folder
 * @return {array} of file path
 */
module.exports = () => {
  const result = []

  for (const filePath of fn.walkSync(fn.publicFolderPath)) {
    result.push(filePath)
  }

  return result
}
