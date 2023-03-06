const Blog =  require('../models/blog')
const User =  require('../models/user')
const bcrypt = require('bcrypt')
const initialBlogs = require('./data')

const blogsInDb = async () => {
    const blogs = await Blog.find({})
    return blogs.map(b =>{
       return b.toJSON()
    })
}

const addUserinDb = async (user) => {
    const passwordHash = await bcrypt.hash(user.password, 10)
    const userObj = new User({
        username : user.username,
        name : user.name,
        passwordHash 
    })
    await userObj.save()
    return userObj
}

const usersinDb = async () => {
    const users = await User.find({})
    return users.map(u =>{
       return u.toJSON()
    })
}

module.exports ={initialBlogs, blogsInDb, usersinDb, addUserinDb}
