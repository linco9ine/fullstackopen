const jwt = require('jsonwebtoken')
const User = require('../models/user')

const tokenExtractor = async (req, res, next) => {
  const authorization = req.get('authorization')
  if (authorization && authorization.startsWith('Bearer ')) {
    req.token = authorization.replace('Bearer ', '')
  }
  next()
}

const userExtractor = async (req, res, next) => {
  const decodedToken = jwt.verify(req.token, process.env.SECRET)
  const user = await User.findById(decodedToken.id)

  req.user = user

  next()
}

module.exports = {
  tokenExtractor,
  userExtractor
}
