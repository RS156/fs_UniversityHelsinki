const express = require('express')
const cors = require('cors')
const mongoose = require('mongoose')
mongoose.set('strictQuery', false)
const config = require('./utils/config')
const blogListRouter = require('./controllers/blogList')
const app = express()


const mongoUrl = config.MONGO_DB_URI
mongoose.connect(mongoUrl)

app.use(cors())
app.use(express.json())
app.use('/api/blogs',blogListRouter)

module.exports = app

