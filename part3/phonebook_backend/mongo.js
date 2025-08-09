const mongoose = require('mongoose')

let URI = null

if (process.argv.length < 3) {
  console.log('Usage: node mongo.js <PASSWORD> <Name> <PhoneNumber>')
  process.exit(1)
}

const personSchema = new mongoose.Schema({
  name: String,
  number: String
})

const Person = new mongoose.model('Person', personSchema)

if (process.argv.length >= 3) {
  URI = `mongodb+srv://fullstackopen:${encodeURIComponent(process.argv[2])}@cluster0.mh3xhfq.mongodb.net/phonebook?retryWrites=true&w=majority&appName=Cluster0`
}

if (process.argv.length === 3) {
  mongoose.connect(URI)
    .then(() => Person.find({}))
    .then((persons) => {
      console.log('phonebook:')
      persons.forEach((person) => {
        console.log(`${person.name} ${person.number}`)
      })
    })
    .catch(err => console.error('Error connecting to MongoDB', err))
    .finally(() => mongoose.connection.close())
}

if (process.argv.length === 5) {
  const person = new Person({
    name: process.argv[3],
    number: process.argv[4]
  })

  mongoose.connect(URI)
    .then(() => person.save())
    .catch(err => console.error('Error connecting to MongoDB', err)).finally(() => mongoose.connection.close())
}
