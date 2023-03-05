const usersRouter = require('express').Router()
const User = require('../models/user')
const bcrypt = require('bcrypt')

usersRouter.get('/', async (request, response) =>{
const users = await User
.find({})
.populate('blogs',{title : true,author:true,url:true, likes:true})
response.status(200).json(users)
})

usersRouter.post('/', async (request, response) =>{
const body = request.body
if(body.password.length <3){
    return response.status(400).send({error:'password should be atleast 3 characters'})
  
}
const saltRounds = 10
const passwordHash = await bcrypt.hash(body.password, saltRounds)
const user = new User({
    username : body.username,
    name: body.name,
    passwordHash
})
const savedUser = await user.save()
console.log(user);
response.status(201).json(savedUser)
})

module.exports = usersRouter