const mongoose = require('mongoose')

if(process.argv.length <3)
{
    console.log('give password as argument');
    process.exit(1)
}

const password = process.argv[2]

const url = `mongodb+srv://notesDb:${password}@cluster0.aaghbyg.mongodb.net/noteApp?retryWrites=true&w=majority`

mongoose.set('strictQuery', false)
mongoose.connect(url)

const noteSchema = new mongoose.Schema(
    {
        content : String,
        impotant : Boolean,
    }
)

const Note = mongoose.model('Note', noteSchema)

const note = new Note({
    content : 'HTML is easy',
    impotant : true,
})

// note.save().then (result => {
//     console.log('note saved!', result);
//     mongoose.connection.close()
// })

Note.find({}).then(res=>
    {
        res.forEach(element => {
            console.log(element.content);
        });
        mongoose.connection.close()
    })