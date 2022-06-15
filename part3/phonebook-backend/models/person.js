const mongoose = require('mongoose')

const url = process.env.MONGODB_URI

console.log('connecting to', url)
mongoose.connect(url)
  .then(() => {
    console.log('connected to MongoDB')
  })
  .catch((error) => {
    console.log('error connecting to MongoDB:', error.message)
  })

const personSchema = new mongoose.Schema({
  name: {
    type: String,
    minlength: 3,
    required: [true, 'Required: name which is at least 2 characters long']
  },
  number: {
    type: String,
    minlength: 8,
    validate: (value) => {
      return /\b\d{3}-\d{4,}\b/.test(value) || /\b\d{2}-\d{5,}\b/.test(value)
    },
    required: [true, 'Required: valid phone number of format xx-xxxxx... or xxx-xxxx...']
  },
})

personSchema.set('toJSON', {
  transform: (document, returnedObject) => {
    returnedObject.id = returnedObject._id.toString()
    delete returnedObject._id
    delete returnedObject.__v
  }
})

module.exports = mongoose.model('Person', personSchema)