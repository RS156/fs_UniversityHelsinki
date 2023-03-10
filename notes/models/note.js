const mongoose = require('mongoose')
mongoose.set('strictQuery', false)

const password = 'Password1'
const url = process.env.MONGODB_URI
console.log('connecting to', url);

mongoose.connect(url)
.then (res => {
    console.log("Connected to url", url);
})
.catch(error => {
    console.log("Error connecting to MongoDB", error.message);
})



const noteSchema = new mongoose.Schema(
    {
        content : {
            type: String,
            minLength : 5,
            required : true
        },
        important : Boolean,
    }
)

noteSchema.set('toJSON', {
    transform: (doc, returnedObject) => {
        returnedObject.id =returnedObject._id.toString()
        delete returnedObject._id
        delete returnedObject.__v
    }
})


//const Note = mongoose.model('Note', noteSchema)

module.exports = mongoose.model('Note', noteSchema)