const express = require('express')
const mongoose = require('mongoose')
const router = require('./controllers/blogs')
const userRouter = require('./controllers/users')
const loginRouter = require('./controllers/login')
const { tokenExtractor } = require('./utils/middleware')
const config = require('./config')

const app = express()
const MONGODB_URI = config.MONGODB_URI

mongoose.connect(MONGODB_URI)
  .then(() => console.log("connected to MongoDB"))
  .catch((err) => console.log(err.message))

app.use(express.json())
app.use(tokenExtractor)

app.use('/api/login', loginRouter)
app.use('/api/blogs', router)
app.use('/api/users', userRouter)

app.use((err, req, res, next) => {
  if (err.name === "ValidationError") {
   return res.status(400).json({ error: err.message })
  } else if (err.name === 'MongoServerError' && err.message.includes('E11000 duplicate key error')) {
    return res.status(400).json({ error: 'expected `username` to be unique' })
  } else if (err.name === 'JsonWebTokenError') {
    return res.status(401).json({ error: "token missing or invalid" })
  }

  next(err)
  //res.status(500).json({ error: "Something went wrong" })
})

module.exports = app
