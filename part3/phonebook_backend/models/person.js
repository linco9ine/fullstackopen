const mongoose = require('mongoose')

let URI = process.env.MONGODB_URI

console.log('Connection to', URI)
mongoose.connect(URI)
  .then(() => console.log('Connected to MongoDB'))
  .catch((err) => console.log('Error connecting to MongoDB:', err.message))

const validatePhoneNumber = (num) => {
  const chars = [...num]
  const hyphenCount = chars.filter(c => c === '-').length

  if (hyphenCount !== 1) {
    return false
  }

  if (chars[2] !== '-' && chars[3] !== '-') {
    return false
  }

  return true
}

const personSchema = new mongoose.Schema({
  name: {
    type: String,
    minLength: 3
  },
  number: {
    type: String,
    minLength: 9,
    validate: {
      validator: validatePhoneNumber,
      message: 'Number length must be at least 8 characters long and in the format "09-123456789" or "091-23456789"'
    }
  }
})

personSchema.set('toJSON', {
  transform: (document, returnedObject) => {
    returnedObject.id = returnedObject._id.toString()
    delete returnedObject._id
    delete returnedObject.__v

  }
})

const Person = new mongoose.model('Person', personSchema)

module.exports = Person
