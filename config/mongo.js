const mongoose = require('mongoose')
const appInfo = require('../settings.json')
const DB_URL = appInfo.MONGO_URI
const loadModels = require('../app/models')

module.exports = () => {
  const connect = () => {
    mongoose.Promise = global.Promise

    mongoose.connect(
      DB_URL,
      {
        keepAlive: true,
        useNewUrlParser: true,
        useUnifiedTopology: true
      },
      (err) => {
        let dbStatus = ''
        if (err) {
          dbStatus = `*    Error connecting to DB: ${err}\n****************************\n`
        }
        dbStatus = `*    DB Connection: OK\n****************************\n`
        if (appInfo.NODE_ENV !== 'test') {
          // Prints initialization
          console.log('****************************')
          console.log('*    Starting Server')
          console.log(`*    Port: ${appInfo.PORT || 3000}`)
          console.log(`*    NODE_ENV: ${appInfo.NODE_ENV}`)
          console.log(`*    Database: MongoDB Atlas`)
          console.log(dbStatus)
        }
      }
    )
  }
  connect()

  mongoose.connection.on('error', console.log)
  mongoose.connection.on('disconnected', connect)

  loadModels()
}
