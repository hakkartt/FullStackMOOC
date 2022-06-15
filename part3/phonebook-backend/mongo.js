const mongoose = require('mongoose')

if (process.argv.length<3) {
  console.log('Give password as argument')
  process.exit(1)
}
else if (process.argv.length === 3) {
  const password = process.argv[2]
  const url =
    `mongodb+srv://arttu:${password}@cluster0.gg4ji.mongodb.net/phonebookApp?retryWrites=true&w=majority`
  mongoose.connect(url)
  const personSchema = new mongoose.Schema({
    name: String,
    number: String,
  })
  const Person = mongoose.model('Person', personSchema)
  console.log('phonebook:')
  Person.find({})
    .then(result => {
      result.forEach(person => {
        console.log(`${person.name} ${person.number}`)
      })
      mongoose.connection.close()
    })
}
else if (process.argv.length === 5) {
  const password = process.argv[2]
  const name = process.argv[3]
  const number = process.argv[4]
  const url =
    `mongodb+srv://arttu:${password}@cluster0.gg4ji.mongodb.net/phonebookApp?retryWrites=true&w=majority`
  mongoose.connect(url)
  const personSchema = new mongoose.Schema({
    name: String,
    number: String,
  })
  const Person = mongoose.model('Person', personSchema)
  const person = new Person({
    name: `${name}`,
    number: `${number}`,
  })
  person.save().then(() => {
    console.log(`Success: Added ${name}`)
    mongoose.connection.close()
  })
} else {
  console.log('Failed: Please give the correct amount of inputs as arguments')
}