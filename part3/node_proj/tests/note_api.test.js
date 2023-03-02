const mongoose = require('mongoose')
const supertest = require('supertest')
const helper = require('./test_helper')
const app = require('../app')
const api = supertest(app)
const Note = require('../models/note')


beforeEach(async () => {
await Note.deleteMany({})
console.log('cleared');
for(let note of helper.initialNotes) 
{
  let noteObj = new Note(note)
  await noteObj.save()
}
   
  },
  10000)



    test('notes are returned as json', async () =>{
    await api
    .get('/api/notes')
    .expect(200)
    .expect('Content-Type',/application\/json/)    
    },100000)

    test('all notes are returned', async () =>{
    const response  = await api.get('/api/notes')
    expect(response.body).toHaveLength(helper.initialNotes.length)    
    })
 
    test('the first note is about HTTP methods', async () =>{
    const response  = await api.get('/api/notes')
    expect(response.body[0].content).toBe('HTML is easy')    
    })

    test('a specific note is within the returened notes', async () =>{
        const response  = await api.get('/api/notes')
        const contents = response.body.map(r=>r.content)
        expect(contents).toContain('Browser can execute only JavaScript')    
        })

    test('a valid note can be added', async () =>{
      const newNote ={
        content: 'async/await simplifies making async calls',
        important: true,
      }
        await api
        .post('/api/notes')
        .send(newNote)
        .expect(201)
        .expect('Content-Type',/application\/json/)

        const notesAtEnd = await helper.notesInDb()
        const contents = notesAtEnd.map(n => n.content)
        expect(notesAtEnd).toHaveLength(helper.initialNotes.length+1)  
        expect(contents).toContain('async/await simplifies making async calls')    
          })
    
  test('note without content is not added', async () =>{
      const newNote ={        
        important: true,
      }
        await api
        .post('/api/notes')
        .send(newNote)
        .expect(400)
        

        const notesAtEnd = await helper.notesInDb()
        expect(notesAtEnd).toHaveLength(helper.initialNotes.length)  
        
          })

   test('a specific note can be viewed', async () =>{
    const notesAtStart = await helper.notesInDb()
    const noteToView = notesAtStart[0]
    const resultNote  = await api
    .get(`/api/notes/${noteToView.id}`)
    .expect(200)
    .expect('Content-Type',/application\/json/)
    expect(resultNote.body).toEqual(noteToView)    
    })

  test('a specific note can be deleted', async () =>{
    const notesAtStart = await helper.notesInDb()
    const noteToDelete = notesAtStart[0]
    const resultNote  = await api
    .delete(`/api/notes/${noteToDelete.id}`)
    .expect(204)
   
    const notesAtEnd = await helper.notesInDb()

    expect(notesAtEnd).toHaveLength(helper.initialNotes.length - 1)    

    const contents = notesAtEnd.map(n => n.content)
    expect(contents).not.toContain(noteToDelete.content)
    })
         


afterAll(async () =>{
    await mongoose.connection.close()
})
    

