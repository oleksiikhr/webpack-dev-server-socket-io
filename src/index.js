'use strict'

console.log('Execute index.js')

if (process.env.NODE_ENV === 'development') {
  /*
   * This code is available only in development mode
   */
  console.log('Only Development')

  require('./dev')
}
