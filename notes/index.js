let notesx = [
    {
        id: 1,
        content: "HTML is easy",
        important: true
    },
    {
        id: 2,
        content: "Browser can execute only JavaScript",
        important: false
    },
    {
        id: 3,
        content: "GET and POST are the most important methods of HTTP protocol",
        important: true
    }
]

require('dotenv').config()
const { response, request } = require('express')
const express = require('express')
const cors = require('cors')
const mongoose = require('mongoose')
const Note = require('./models/note')

const app = express()
app.use(cors())
app.use(express.json())

const requestLogger = (request, response, next)=> {
    console.log('Method', request.method);
    console.log('Path', request.path);
    console.log('Body', request.body);
    console.log('---');
    next()
}

app.use(requestLogger)

app.get('/', (request, response) => {
    response.send('<h1>Hello World</h1>')
})

app.get('/api/notes', (request, response) => {
    Note.find({}).then(
        notes => {
            response.json(notes)
        }
    )
    
})

app.get('/api/notes/:id', (request, response,next) => { 
      Note.findById(request.params.id)
      .then(note =>{
        if(note){
            response.json(note)
        }
        else{
            response.status(404).end()
        }
      })
      .catch(error => next(error))
})

app.delete('/api/notes/:id',(request, response,next) =>{
    Note.findByIdAndRemove(request.params.id)
    .then(note =>{
      response.status(204).end()
    })
    .catch(error => next(error))
})

const generateId = () =>{
    const maxId =notes.length > 0 
    ? Math.max (...notes.map(n=>n.id))
    : 0
    return maxId +1
}


app.put('/api/notes/:id',(request, response,next) =>{
    const body = request.body

    const note = {
        content: body.content,
        important: body.important,    
    }

    Note.findByIdAndUpdate(request.params.id, note, {new:true})
    .then(updatedNote =>{
      response.json(updatedNote)
    })
    .catch(error => next(error))
})

app.post('/api/notes',(request,response, next) => {
    

    const body = request.body
    // if(!body.content)
    // {
    //     return response.status(400).json({error : 'content missing'})
    // }
    const note = new Note({
        content : body.content,
        important: body.important || false,      
    })
    note.save().then(savedNote => {
        response.json(savedNote)
    })
    .catch(error => next(error))    
})

const unknownEndpoint = (request, response) => {
    response.status(404).send({error : 'unkown endpoint'})
}

app.use(unknownEndpoint)

const errorhandler = (error, request, response, next) => {
    console.error(error.message)

    if(error.name === 'CastError'){
        return response.status(400).send({error :'malformatted id'})
    }
    else if (error.name = 'ValidationError')
    {
        return response.status(400).send({error :error.message})
    }
    next(error)
}

app.use(errorhandler )
const PORT = process.env.PORT
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
})
