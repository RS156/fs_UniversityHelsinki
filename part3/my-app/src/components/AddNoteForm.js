import Utils from './Utils'
import { useState } from 'react'
import noteService from '../services/notes'

const Input = Utils.Input

const AddNote = ({ noteState, noteFormRef }) => {
  console.log('note form ref in add notes', noteFormRef)
  const [newNote, setNewNote] = useState('a new note...')
  const [notes, setNotes] = noteState
  const handleAddNote = (event) => {
    event.preventDefault()
    noteFormRef.current.toggleVisibility()
    const newNoteObj = {
      content: newNote,
      important: true
    }
    noteService
      .create(newNoteObj)
      .then(response => {
        setNotes(notes.concat(response.data))
        setNewNote('')
      })
  }

  return (<div className='formDiv'>
    <h2>Create a new note</h2>
    <form onSubmit={handleAddNote}>
      <Input id='note-input' inputState={[newNote, setNewNote]} type='text' />
      <button type='submit'>save</button>
    </form>
  </div>)
}

export default AddNote