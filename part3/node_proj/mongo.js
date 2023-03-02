const mongoose = require('mongoose')
const config = require('./utils/config')

// if (process.argv.length<3) {
//   console.log('give password as argument')
//   process.exit(1)
// }

//const password = process.argv[2]

const url = process.env.TEST_MONGODB_URI
  

mongoose.set('strictQuery',false)
mongoose.connect(url)

const noteSchema = new mongoose.Schema({
  content: String,
  date: Date,
  important: Boolean,
})

const Note = mongoose.model('Note', noteSchema)

const note = new Note({
  content: 'CSS is hard',
  date: new Date(),
  important: true,
})



note.save().then(result => {
  console.log('note saved!')
  mongoose.connection.close()
})


// Note.find({}).then(result => {
//   result.forEach(note => {
//     console.log(note)
//   })
//   mongoose.connection.close()
// })