const { buildErrObject } = require('./buildErrObject')
const { buildSuccObject } = require('./buildSuccObject')
const { handleError } = require('./handleError')
const { isIDGood } = require('./isIDGood')
const { itemNotFound } = require('./itemNotFound')
const { removeExtensionFromFile } = require('./removeExtensionFromFile')


module.exports = {
  buildErrObject,
  buildSuccObject,
  handleError,
  isIDGood,
  itemNotFound,
  removeExtensionFromFile,
}
