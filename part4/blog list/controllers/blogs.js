const blogListRouter = require('express').Router()
const Blog = require('../models/blog')
const User = require('../models/user')

blogListRouter.get('/', async (request, response) => {
    const blogs = await Blog
    .find({})
    .populate('user',{username:true, name:true})
    response.json(blogs)

})

blogListRouter.post('/', async (request, response) => {
    if (!request.body.title || !request.body.url) {
        return response.status(400).end()
    }
    if (!request.body.likes) {
        request.body.likes = 0
    }
    const blog = new Blog(request.body)
    const result = await blog.save()
    const user = await User.findById(request.body.user) 
    user.blogs = user.blogs.concat(result.id)
    await user.save()
    response.status(201).json(result)

})

blogListRouter.get('/:id', async (request, response) => {
    const blog = await Blog.findById(request.params.id)
    if (blog) {
        response.json(blog)
    }
    else {
        response.status(404).end()
    }

})

blogListRouter.delete('/:id', async (request, response) => {
    await Blog.findByIdAndRemove(request.params.id)
    response.status(204).end()
})

blogListRouter.put('/:id', async (request, response) => {
    const body = request.body
    const isValid = body.title && body.author && body.url && body.likes
    if(!isValid)
    {
        return response.status(400).end()
    }
    const blog = {
        'title' : body.title,
        'author' : body.author,
        'url' : body.url,
        'likes' : body.likes
    }
    const updatedBlog = await Blog.findByIdAndUpdate(request.params.id, blog, {new: true})
    response.json(updatedBlog)
})

module.exports = blogListRouter