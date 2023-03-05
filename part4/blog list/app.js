const express = require('express')
require('express-async-errors')
const cors = require('cors')
const mongoose = require('mongoose')
mongoose.set('strictQuery', false)
const config = require('./utils/config')
const blogListRouter = require('./controllers/blogs')
const usersRouter = require('./controllers/users')
const middleware = require('./utils/middleware')
const app = express()


const mongoUrl = config.MONGO_DB_URI
mongoose.connect(mongoUrl)

app.use(cors())
app.use(express.json())
app.use('/api/users',usersRouter)
app.use('/api/blogs',blogListRouter)
app.use(middleware.unknownEndpoint)
app.use(middleware.errorHandler)

module.exports = app

