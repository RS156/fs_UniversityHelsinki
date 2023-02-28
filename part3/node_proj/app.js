const express = require('express')
const cors = require('cors')

const config = require('./utils/config')
const logger =require('./utils/logger')
const middleware = require('./utils/middleware')
const notesRouter = require('./controllers/notes')

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
app.use('/api/notes', notesRouter)
app.use(middleware.unknownEndpoint)
app.use(middleware.errorHandler )

module.exports = app