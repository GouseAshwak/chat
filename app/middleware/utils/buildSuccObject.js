/**
 * Builds success object
 * @param {string} message - success text
 * @param {string} status  - success status
 */
const buildSuccObject = (status= '',message = '') => {
  return {
    status:status,
    message: message
  }
}

module.exports = { buildSuccObject }
