const mongoose = require('mongoose')
const supertest = require('supertest')
const bcrypt = require('bcrypt')
const helper = require('./test_helper')
const app = require('../app')
const api = supertest(app)

const Note = require('../models/note')
const User = require('../models/user')

beforeEach(async () => {
  await Note.deleteMany({})
  await Note.insertMany(helper.initialNotes)  
},
  10000)

describe('when there is initilly some notes saved', () => {
  test('notes are returned as json', async () => {
    await api
      .get('/api/notes')
      .expect(200)
      .expect('Content-Type', /application\/json/)
  }, 100000)

  test('all notes are returned', async () => {
    const response = await api.get('/api/notes')
    expect(response.body).toHaveLength(helper.initialNotes.length)
  })

  test('the first note is about HTTP methods', async () => {
    const response = await api.get('/api/notes')
    expect(response.body[0].content).toBe('HTML is easy')
  })

  test('a specific note is within the returened notes', async () => {
    const response = await api.get('/api/notes')
    const contents = response.body.map(r => r.content)
    expect(contents).toContain('Browser can execute only JavaScript')
  })
})

describe('viewing a specific note', () => {
  test('a specific note can be viewed', async () => {
    const notesAtStart = await helper.notesInDb()
    const noteToView = notesAtStart[0]
    const resultNote = await api
      .get(`/api/notes/${noteToView.id}`)
      .expect(200)
      .expect('Content-Type', /application\/json/)
    expect(resultNote.body).toEqual(noteToView)
  })

  test('fails with status code 404 if notes does not exist', async () => {
    const validNoneExistingId = await helper.nonExistingId()

    await api
      .get(`/api/notes/${validNoneExistingId}`)
      .expect(404)
  })

  test('fails with status code 400 if is is invalid', async () => {
    const invalidId = '23erer3424234212dsd21c222'

    await api
      .get(`/api/notes/${invalidId}`)
      .expect(400)
  })
})

describe('addition of new note', () => {

let headers

beforeAll(async () =>{
  await User.deleteMany({})
  const passwordHash = await bcrypt.hash('sekret', 10)
  const user = new User({
    username: 'root', passwordHash
  })
  await user.save()

  const response = await api.post('/api/login')
  .send({username: 'root', password : 'sekret' }) 
  
  const authToken = 'Bearer '+ response.body.token
  headers = {
    'Authorization' : authToken,
    'Content-Type':'application/json'
  }  
}, 10000)

  test('a valid note can be added', async () => {
    const newNote = {
      content: 'async/await simplifies making async calls',
      important: true,
    }
    await api
      .post('/api/notes')
      .set(headers)
      .send(newNote)
      .expect(201)
      .expect('Content-Type', /application\/json/)

    const notesAtEnd = await helper.notesInDb()
    const contents = notesAtEnd.map(n => n.content)
    expect(notesAtEnd).toHaveLength(helper.initialNotes.length + 1)
    expect(contents).toContain('async/await simplifies making async calls')
  })

  test('fails with status code 400 if data is invalid', async () => {
    const newNote = {
      important: true,
    }
    await api
      .post('/api/notes')
      .send(newNote)
      .expect(400)

    const notesAtEnd = await helper.notesInDb()
    expect(notesAtEnd).toHaveLength(helper.initialNotes.length)
  })
})

describe('deletion of note', () => {
  test('succeeds with status code 204 if id is valid', async () => {
    const notesAtStart = await helper.notesInDb()
    const noteToDelete = notesAtStart[0]
    const resultNote = await api
      .delete(`/api/notes/${noteToDelete.id}`)
      .expect(204)

    const notesAtEnd = await helper.notesInDb()

    expect(notesAtEnd).toHaveLength(helper.initialNotes.length - 1)

    const contents = notesAtEnd.map(n => n.content)
    expect(contents).not.toContain(noteToDelete.content)
  })
})

describe('when there is initially 1 user in db',() =>{

  beforeEach(async () =>{
    await User.deleteMany({})
    const passwordhash = await bcrypt.hash('sekret', 10)
    const user = new User({
      username: 'root', passwordhash
    })
    await user.save()
  })

  test('creation succeeds with fresh username', async ()=>{
    const usersAtStart = await helper.usersInDb()
    const newUser = {
      username : 'rs',
      name : 'Rishabh Sarkar',
      password:'Password'
    }
    await api.post('/api/users')
    .send(newUser)
    .expect(201)
    .expect('Content-Type', /application\/json/)

    const usersAtEnd = await helper.usersInDb()
    expect(usersAtEnd).toHaveLength(usersAtStart.length +1)
    const usernames= usersAtEnd.map(u => u.username)
    expect(usernames).toContain(newUser.username)
  })

  test('creation fails with 400 status code and message is username is already taken', async ()=>{
    const usersAtStart = await helper.usersInDb()
    const newUser = {
      username : 'root',
      name : 'Rishabh Sarkar2',
      password:'Password'
    }
    const result = await api.post('/api/users')
    .send(newUser)
    .expect(400)
    .expect('Content-Type', /application\/json/)

    expect(result.body.error).toContain('expected `username` to be unique')
    const usersAtEnd = await helper.usersInDb()
    expect(usersAtEnd).toHaveLength(usersAtStart.length)  
  })


})


afterAll(async () => {
  await mongoose.connection.close()
})


