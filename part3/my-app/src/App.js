import { useState, useEffect } from "react";
import Note from './components/Note'
import noteService from './services/notes'

const Notification = ({message}) => {
    if(message ===null){
        return null
    }

    return (
        <div className="error">{message}</div>
    )
}

const Footer = () => {
    const footerStyle = {
        color : 'green',
        fontStyle: 'italic',
        fontSize : 16
    }
    return(
        <div style={footerStyle}>
            <br />
            <em>Note app, Depatment of Computer Science, University of Helsinki</em>
        </div>
    )
}

const App = () => {    
    const [notes, setNotes] = useState([])
    const [newNote, setNewNote] = useState('a new note...')
    const [showAll, setShowAll] = useState(true)
    const [errorMessage, setErrorMessage] = useState(null)

const hook = () => {
    console.log('effect');
    noteService
        .getAll()
        .then(response => {
            console.log('promise fulfilled', response);
            setNotes(response)
        })
}

    useEffect(hook, [])
    console.log(notes);
    console.log('render', notes.length, 'notes');

    const notesToDisplay = showAll ? notes : notes.filter( note => note.important)

    const addNote = (event) => {
        event.preventDefault()
        console.log('button clicked', event.target);
        const newNoteObj = {
            content : newNote,            
            important : Math.random() < 0.5
        }
        noteService
            .create(newNoteObj)
            .then(response => {
                console.log(response);
                setNotes(notes.concat(response.data))
                setNewNote('')
            })

        
    }

    const toggleImportanceOf = (id) => () => {        
        const note = notes.find((n) => n.id===id)
        const changedNote = {...note,important:!note.important}
        noteService
            .update(id, changedNote)
            .then(response => {
                setNotes(notes.map(n => n.id ===id ? response.data : n))
            } )
            .catch(error => {
                setErrorMessage(`Note ${note.content} was already deleted from the server`)
                setTimeout(()=>{setErrorMessage(null)}, 5000)
                setNotes(notes.filter(n => n.id !== id))
            })
    }

    const handleNoteChange = (event) => {        
        console.log(event.target.value);
        setNewNote(event.target.value)
    }

    return (
        <div>
            <h1>Notes</h1>
            <Notification message={errorMessage} />
            <div>
                <button onClick={() => setShowAll(!showAll)}>
                    show {showAll? 'important' : 'all'} </button>
            </div>
            <ul>
                {notesToDisplay
                .map((note) => <Note key ={note.id} note ={note} toggleImportance={toggleImportanceOf(note.id)}/>)}
                        
            </ul>
            <form onSubmit ={addNote}>
                <input value = {newNote} onChange={handleNoteChange}/>
                <button type='submit'>save</button>
            </form>
            <Footer />
        </div>
    )
}

export default App;
