import { useState, useEffect, useRef } from 'react'
import Note from './components/Note'
import LoginForm from './components/LoginForm'
import AddNoteForm from './components/AddNoteForm'
import noteService from './services/notes'
import Togglable from './components/Togglable'

const Notification = ({ message }) => {
  if (message === null) {
    return null
  }

  return (
    <div className="error">{message}</div>
  )
}

const Footer = () => {
  const footerStyle = {
    color: 'green',
    fontStyle: 'italic',
    fontSize: 16
  }
  return (
    <div style={footerStyle}>
      <br />
      <em>Note app, Depatment of Computer Science, University of Helsinki</em>
    </div>
  )
}

const App = () => {
  const [notes, setNotes] = useState([])
  const [showAll, setShowAll] = useState(true)
  const [errorMessage, setErrorMessage] = useState(null)
  const [user, setUser] = useState(null)
  const noteFormRef = useRef()

  const hook = () => {    console.log('effect')
    noteService
      .getAll()
      .then(response => {
        console.log('promise fulfilled', response)
        setNotes(response)
      })
  }

  useEffect(hook, [])

  useEffect(() => {
    const loggedUserJSON = window.localStorage.getItem('loggedNoteAppUser')
    if(loggedUserJSON){
      const user = JSON.parse(loggedUserJSON)
      setUser(user)
      noteService.setToken(user.token)
    }

  }, [])
  console.log('noteform ref', noteFormRef)

  const notesToDisplay = showAll ? notes : notes.filter(note => note.important)



  const toggleImportanceOf = (id) => () => {
    const note = notes.find((n) => n.id === id)
    const changedNote = { ...note, important: !note.important }
    noteService
      .update(id, changedNote)
      .then(response => {
        setNotes(notes.map(n => n.id === id ? response.data : n))
      })
      .catch(_error => {
        setErrorMessage(`Note ${note.content} was already deleted from the server`)
        setTimeout(() => { setErrorMessage(null) }, 5000)
        setNotes(notes.filter(n => n.id !== id))
      })
  }

  const handleLogout = () => {
    window.localStorage.clear()
    setUser(null)
  }



  return (
    <div>
      <h1>Notes</h1>
      <Notification message={errorMessage} />
      {!user &&
            <Togglable buttonLabel = 'login'>
              <LoginForm setUser={setUser} setErrorMessage={setErrorMessage} />
            </Togglable>}

      {user && <div>
        <p>{user.name} is logged in</p>
        <Togglable buttonLabel='new note' ref ={noteFormRef} >
          <AddNoteForm noteState={[notes, setNotes]} noteFormRef={noteFormRef} />
        </Togglable>
        <button onClick={handleLogout}>
                Logout </button>
      </div>
      }

      <div>
        <button onClick={() => setShowAll(!showAll)}>
                    show {showAll ? 'important' : 'all'} </button>
      </div>
      <ul>
        {notesToDisplay
          .map((note) => <Note key={note.id} note={note} toggleImportance={toggleImportanceOf(note.id)} />)}

      </ul>
      <Footer />
    </div>
  )
}

export default App
