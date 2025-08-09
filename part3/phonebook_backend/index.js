require('dotenv').config()
const express = require('express')
const morgan = require('morgan')
const Person = require('./models/person')

const app = express()
const PORT = process.env.PORT || 3001

app.use(express.static('dist'))

app.use(express.json())

morgan.token('req-body', (req) => {
  return req.body ? JSON.stringify(req.body) : undefined
})

app.use(morgan(':method :url :status :response-time ms - :res[content-length] :req-body'))

app.get('/info', (req, res, next) => {
  Person
    .find({})
    .then(persons => {
      res.send(`
        <p>Phonebook has info for ${persons.length} people</p>
        <p>${new Date()}</p>
      `)
    })
    .catch(next)
})

app.get('/api/persons', (req, res, next) => {
  Person
    .find({})
    .then(persons => {
      res.json(persons)
    })
    .catch(next)
})

app.get('/api/persons/:id', (req, res, next) => {
  const id = req.params.id
  Person
    .findById(id)
    .then(person => {
      if (person) {
        return res.json(person)
      }

      res.status(404).json({ error: 'Person not found' })
    })
    .catch(next)

})

app.delete('/api/persons/:id', (req, res, next) => {
  const id = req.params.id
  Person
    .findByIdAndDelete(id)
    .then(() => res.status(204).end())
    .catch(next)
})

app.post('/api/persons', (req, res, next) => {
  const person = { ...req.body }
  const { name, number } = person
  if (!name || !number) {
    return res.status(400).json({ error: 'Content missing' })
  }

  Person
    .findOne({ name })
    .then(existingPerson => {
      if (existingPerson) {
        return res.status(409).json({ error: 'name must be unique' })
      }

      return Person.create({ name, number })
    })
    .then(createdPerson => {
      if (createdPerson) res.status(201).json(createdPerson)
    })
    .catch(next)
})

app.put('/api/persons/:id', (req, res, next) => {
  const id = req.params.id
  const { number } = req.body
  Person
    .findById(id)
    .then(person => {
      if (!person) {
        return res.status(404).end()
      }

      person.number = number

      return person.save().then(updatedPerson => {
        res.json(updatedPerson)
      })
    })
    .catch(next)
})

// eslint-disable-next-line no-unused-vars
const errorHandler = (err, req, res, next) => {
  console.log(err.message)

  if (err.name === 'CastError') {
    return res.status(400).json({ error: 'malformatted id' })
  } else if (err.name === 'ValidationError') {
    return res.status(400).json({ error: err.message })
  }

  res.status(500).json({ error: '500 Internal Server Error' })
}

app.use((req, res) => {
  res.status(404).json({ error: 'unknown endpoint' })
})

app.use(errorHandler)

app.listen(PORT, () => console.log(`Server running on  http://localhost:${PORT}`))
