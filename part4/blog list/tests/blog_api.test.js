const mongoose = require('mongoose')
const supertest = require('supertest')
const app = require('../app')
const Blog = require('../models/blog')
const logger = require('../utils/logger')
const helper = require('./test_helper')

const api = supertest(app)


beforeEach(async () => {
    await Blog.deleteMany({})
    await Blog.insertMany(helper.initialBlogs)
}, 100000)

describe('getting all blogs', () => {
    test('blogs are returned as expected', async () => {
        await api.get('/api/blogs')
            .expect(200)
            .expect('Content-Type', /application\/json/)
    })

    test('specific blog returned as expected', async () => {
        const blogsInDb = await helper.blogsInDb()
        const blogToView = blogsInDb[0]
        const resultBlog = await api.get(`/api/blogs/${blogToView.id}`)
            .expect(200)
            .expect('Content-Type', /application\/json/)
        expect(resultBlog.body.id).toBeDefined()
        expect(resultBlog.body).toEqual(blogToView)
    })
})

describe('addition of new blogs', () => {
    test('new Blog can be added', async () => {
        const newBlog = {
            title: "New blog added for unit testing",
            author: "Rishabh Sarkar",
            url: "http://testurl.com",
            likes: 12,
        }
        
        await api.post('/api/blogs')
            .send(newBlog)
            .expect(201)
            .expect('Content-Type', /application\/json/)

        const blogsAtEnd = await helper.blogsInDb()
        expect(blogsAtEnd.length).toEqual(helper.initialBlogs.length + 1)
        expect(blogsAtEnd)
            .toEqual(
                expect.arrayContaining([
                    expect.objectContaining(newBlog)
                ]))
    })

    test('when likes is missing, it is set to zero', async () => {
        const newBlog = {
            title: "New blog added for unit testing",
            author: "Rishabh Sarkar",
            url: "http://testurl.com",
        }
        
        await api.post('/api/blogs')
            .send(newBlog)
            .expect(201)
            .expect('Content-Type', /application\/json/)

        const blogsAtEnd = await helper.blogsInDb()
        const expBlog = newBlog
        expBlog.likes = 0
        expect(blogsAtEnd)
            .toEqual(
                expect.arrayContaining([
                    expect.objectContaining(expBlog)
                ]))
    })

    test('blog with no title cannot be added', async () => {
        const newBlog = {
            author: "Rishabh Sarkar",
            url: "http://testurl.com",
            likes: 12,
        }

        await api.post('/api/blogs')
            .send(newBlog)
            .expect(400)

    })

    test('blog with no url cannot be added', async () => {
        const newBlog = {
            title: "New blog added for unit testing",
            author: "Rishabh Sarkar",
            likes: 12,
        }  

        await api.post('/api/blogs')
            .send(newBlog)
            .expect(400)
    })
})

describe('deletion of blogs', () =>{
    test('deletes specific blog with status as 204', async ()=>{
        const blogsAtStart = await helper.blogsInDb()
        const blogToDelete = blogsAtStart[0]
        console.log(blogToDelete);
        await api.delete(`/api/blogs/${blogToDelete.id}`)
        .expect(204)

        const blogsAtEnd = await helper.blogsInDb()
        const ids = blogsAtEnd.map(b => b.id)
        expect(blogsAtEnd.length).toEqual(blogsAtStart.length - 1)
        expect(ids).not.toContain(blogToDelete.id)
    })
})

describe('updating exisitng blog', () =>{
    test('updates existing blog', async ()=>{
        const blogsAtStart = await helper.blogsInDb()
        const blogToUpdate = blogsAtStart[0]     
        const updatedBlog = {
            title: "Blog being updated",
            author: "Rishabh Sarkar",
            url: "http://testurl.com",
            likes: 102,
        }
        
        const res = await api
        .put(`/api/blogs/${blogToUpdate.id}`)
        .send(updatedBlog)

        expect(res.body).toEqual(expect.objectContaining(updatedBlog))

        const blogsAtEnd = await helper.blogsInDb()        
        expect(blogsAtEnd.length).toEqual(blogsAtStart.length)
        const blogAfterUpdate = blogsAtEnd.find(b => b.id===blogToUpdate.id)
        expect(blogAfterUpdate)
            .toEqual(             
                    expect.objectContaining(updatedBlog)
                )
    })

    test('when author is missing put returns with status code 400', async ()=>{
        const blogsAtStart = await helper.blogsInDb()
        const blogToUpdate = blogsAtStart[0]     
        const updatedBlog = {
            title: "Blog being updated",      
            url: "http://testurl.com",
            likes: 102,
        }
        
        const res = await api
        .put(`/api/blogs/${blogToUpdate.id}`)
        .send(updatedBlog)
        .expect(400)        

        const blogsAtEnd = await helper.blogsInDb()        
        expect(blogsAtEnd.length).toEqual(blogsAtStart.length)
        const blogAfterUpdate = blogsAtEnd.find(b => b.id===blogToUpdate.id)
        expect(blogAfterUpdate)
        .not
        .toEqual(expect.objectContaining(updatedBlog))
    })

    test('when url is missing put returns with status code 400', async ()=>{
        const blogsAtStart = await helper.blogsInDb()
        const blogToUpdate = blogsAtStart[0]     
        const updatedBlog = { 
            title: "Blog being updated",          
            author: "Rishabh Sarkar",
            likes: 102,
        }
        
        const res = await api
        .put(`/api/blogs/${blogToUpdate.id}`)
        .send(updatedBlog)
        .expect(400)        

        const blogsAtEnd = await helper.blogsInDb()        
        expect(blogsAtEnd.length).toEqual(blogsAtStart.length)
        const blogAfterUpdate = blogsAtEnd.find(b => b.id===blogToUpdate.id)
        expect(blogAfterUpdate)
        .not
        .toEqual(expect.objectContaining(updatedBlog))
    })

    test('when title is missing put returns with status code 400', async ()=>{
        const blogsAtStart = await helper.blogsInDb()
        const blogToUpdate = blogsAtStart[0]     
        const updatedBlog = {           
            author: "Rishabh Sarkar",
            url: "http://testurl.com",
            likes: 102,
        }
        
        const res = await api
        .put(`/api/blogs/${blogToUpdate.id}`)
        .send(updatedBlog)
        .expect(400)        

        const blogsAtEnd = await helper.blogsInDb()        
        expect(blogsAtEnd.length).toEqual(blogsAtStart.length)
        const blogAfterUpdate = blogsAtEnd.find(b => b.id===blogToUpdate.id)
        expect(blogAfterUpdate)
        .not
        .toEqual(expect.objectContaining(updatedBlog))
    })

    test('when likes is missing put returns with status code 400', async ()=>{
        const blogsAtStart = await helper.blogsInDb()
        const blogToUpdate = blogsAtStart[0]     
        const updatedBlog = {  
            title: "Blog being updated",         
            author: "Rishabh Sarkar",
            url: "http://testurl.com",
        }
        
        const res = await api
        .put(`/api/blogs/${blogToUpdate.id}`)
        .send(updatedBlog)
        .expect(400)        

        const blogsAtEnd = await helper.blogsInDb()        
        expect(blogsAtEnd.length).toEqual(blogsAtStart.length)
        const blogAfterUpdate = blogsAtEnd.find(b => b.id===blogToUpdate.id)
        expect(blogAfterUpdate)
        .not
        .toEqual(expect.objectContaining(updatedBlog))
    })
})
