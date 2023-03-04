const Blog =  require('../models/blog')
const initialBlogs = require('./data')

const blogsInDb = async () => {
    const blogs = await Blog.find({})
    return blogs.map(b =>{
        console.log(b)
        console.log(b.toJSON());
       return b.toJSON()
    })
}

module.exports ={initialBlogs, blogsInDb}
