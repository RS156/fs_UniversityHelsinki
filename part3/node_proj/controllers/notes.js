const notesRouter = require('express').Router()
const Note = require('../models/note')

notesRouter.get('/', async (request, response) => {
	const notes = await Note.find({})		
	response.json(notes)		
	    
})

notesRouter.get('/:id', async (request, response,next) => {
		const note = await Note.findById(request.params.id)		
		if(note){
			response.json(note)
		}
		else{
			response.status(404).end()
		}	
})

notesRouter.delete('/:id',async (request, response,next) =>{
	await Note.findByIdAndRemove(request.params.id)		
	response.status(204).end()	
})

notesRouter.put('/:id',(request, response,next) =>{
	const body = request.body
	const note = {
		content: body.content,
		important: body.important,    
	}
	Note.findByIdAndUpdate(request.params.id, note, {new:true, runValidators: true, context: 'query'})
		.then(updatedNote =>{
			response.json(updatedNote)
		})
		.catch(error => next(error))
})

notesRouter.post('/',async (request,response, next) => {   
	const body = request.body
	if(!body.content)
	{
	    return response.status(400).json({error : 'content missing'})
	}
	const note = new Note({
		content : body.content,
		important: body.important || false,      
	})
	try {
	const savedNote = await note.save()	
    response.status(201).json(savedNote)
	}
	catch(exception){
		next(exception)
	}

		  
})

module.exports = notesRouter