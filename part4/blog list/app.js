const express = require('express')
require('express-async-errors')
const cors = require('cors')
const mongoose = require('mongoose')
mongoose.set('strictQuery', false)
const config = require('./utils/config')
const blogListRouter = require('./controllers/blogs')
const usersRouter = require('./controllers/users')
const loginRouter = require('./controllers/login')
const middleware = require('./utils/middleware')
const app = express()


const mongoUrl = config.MONGO_DB_URI
mongoose.connect(mongoUrl)

app.use(cors())
app.use(express.json())
app.use(middleware.tokenExtractor)
app.use('/api/login',loginRouter)
app.use('/api/users',usersRouter)
app.use('/api/blogs',middleware.userExtractor, blogListRouter)

if(process.env.NODE_ENV === 'test')
{
    const testingRouter = require('./controllers/testing')
    app.use('/api/testing',testingRouter)
}

app.use(middleware.unknownEndpoint)
app.use(middleware.errorHandler)

module.exports = app

