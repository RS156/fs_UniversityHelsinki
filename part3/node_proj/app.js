const express = require('express')
require('express-async-errors')
const cors = require('cors')
const config = require('./utils/config')
const logger =require('./utils/logger')
const middleware = require('./utils/middleware')
const notesRouter = require('./controllers/notes')
const usersRouter = require('./controllers/users')
const loginRouter = require('./controllers/login')

const app = express()

const mongoose = require('mongoose')
mongoose.set('strictQuery', false)

const url = config.MONGODB_URI
logger.info('connecting to', url);

mongoose.connect(url)
.then (res => {
    logger.info("Connected to url", url);
})
.catch(error => {
    logger.error("Error connecting to MongoDB", error.message);
})

app.use(cors())
app.use(express.static('build'))
app.use(express.json())
app.use(middleware.requestLogger)
app.use('/api/login', loginRouter)
app.use('/api/users', usersRouter)
app.use('/api/notes', notesRouter)

if(process.env.NODE_ENV === 'test'){
    const testingRouter = require('./controllers/testingRouter')
    app.use('/api/testing', testingRouter)
}
app.use(middleware.unknownEndpoint)
app.use(middleware.errorHandler )

module.exports = app