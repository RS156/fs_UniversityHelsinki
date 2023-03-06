const loginRouter = require('express').Router()
const User = require('../models/user')
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')

loginRouter.post('/', async (request, response)=>{

 const {username, password} = request.body
 const user = await User.findOne({username})
 const isPasswordCorrect = user 
 ? await bcrypt.compare(password, user.passwordHash)
 : false

 if(!isPasswordCorrect){
    return response.status(400).send({error :'incorrect username or password'})
 }

 const userObj = {
    'username': user.username,
    'id':user._id
 }

 const token = jwt.sign(userObj, process.env.SECRET)

 response.status(200).json({token, username: user.username, name:user.name})

})

module.exports = loginRouter