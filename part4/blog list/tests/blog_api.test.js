const supertest = require('supertest')
const app = require('../app')
const Blog = require('../models/blog')
const User =  require('../models/user')
const helper = require('./test_helper')

const api = supertest(app)

let headers
let initialBlogsWithUser

beforeAll(async () =>{
    await User.deleteMany({})
    const newUser = {
        "username" : "root",
        "name" : "Super User",
        "password": "Password"
    }
    const user = await helper.addUserinDb(newUser)
    delete newUser.name
    const result = await api
    .post('/api/login')
    .send(newUser)
    .expect(200)

    headers = {
        'Authorization' : 'Bearer ' + result.body.token ,
        'Content-Type' : 'application/json'
    }

    initialBlogsWithUser = helper.initialBlogs.map(b => {
        b.user = user._id
        return b
    })
}, 100000)

beforeEach(async () => {
    await Blog.deleteMany({})
    await Blog.insertMany(initialBlogsWithUser)
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
        blogToView.user = blogToView.user.toString()
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
            .set(headers)
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
        .set(headers)
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
        .set(headers)
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
        .set(headers)
            .send(newBlog)
            .expect(400)
    })

    test('new Blog addition fails with 401 status if headers are not provided', async () => {
        const newBlog = {
            title: "New blog added for unit testing",
            author: "Rishabh Sarkar",
            url: "http://testurl.com",
            likes: 12,
        }
        
        await api.post('/api/blogs')  
            .send(newBlog)
            .expect(401)           

        const blogsAtEnd = await helper.blogsInDb()
        expect(blogsAtEnd.length).toEqual(helper.initialBlogs.length)        
    })

})

describe('deletion of blogs', () =>{
    test('deletes specific blog with status as 204', async ()=>{
        const blogsAtStart = await helper.blogsInDb()
        const blogToDelete = blogsAtStart[0]
        await api.delete(`/api/blogs/${blogToDelete.id}`)
        .set(headers)
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

describe('creating users with 1 user intially stored in db', () =>{
    beforeEach(async ()=>{
        await User.deleteMany({})
        const newUser = {
            "username" : "root",
            "name" : "Super User",
            "password": "Password"
        }
        await helper.addUserinDb(newUser)
    })

    test('new user is created successfully with unique username', async () =>{
        const usersAtStart = await helper.usersinDb()
        const newUser = {
            "username" : "uniqueUser",
            "name" : "Second User",
            "password": "Password"
        }
        await api.post('/api/users')
        .send(newUser)
        .expect(201)
        .expect('Content-Type', /application\/json/)

        const usersAtEnd = await helper.usersinDb()
        expect(usersAtEnd).toHaveLength(usersAtStart.length + 1)
        delete newUser.password
        expect(usersAtEnd)
            .toEqual(
                expect.arrayContaining([
                    expect.objectContaining(newUser)
                ]))
    })

    test('user is not created with 400 status when username is less than 3 characters', async () =>{
        const usersAtStart = await helper.usersinDb()
        const newUser = {
            "username" : "un",
            "name" : "Second User",
            "password": "Password"
        }
        const result = await api.post('/api/users')
        .send(newUser)
        .expect(400)        

        expect(result.body.error).toContain('shorter than the minimum allowed length')
        const usersAtEnd = await helper.usersinDb()
        expect(usersAtEnd).toHaveLength(usersAtStart.length)
       
    })

    test('user is not created with 400 status when password is less than 3 characters', async () =>{
        const usersAtStart = await helper.usersinDb()
        const newUser = {
            "username" : "newUser",
            "name" : "Second User",
            "password": "Pa"
        }
        const result = await api.post('/api/users')
        .send(newUser)
        .expect(400)        

        expect(result.body.error).toContain('password should be atleast 3 characters')
        const usersAtEnd = await helper.usersinDb()
        expect(usersAtEnd).toHaveLength(usersAtStart.length)
    })


})
