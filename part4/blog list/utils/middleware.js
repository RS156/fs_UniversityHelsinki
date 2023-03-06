const logger = require('./logger')
const User = require('../models/user')
const jwt = require('jsonwebtoken')

const unknownEndpoint = (request, response) =>{
    response.status(404).send({error: 'unknown endpoint'})
}

const tokenExtractor = (request, response, next) =>{
    const auth = request.get('Authorization')
    if( auth && auth.startsWith('Bearer '))
    {
        request.token = auth.replace('Bearer ', '')
    }
    else{
        request.token = null
    }
    next()
}

const userExtractor = async (request, response, next) =>{
    if(request.token)
    {
        const decodedToken = jwt.verify(request.token, process.env.SECRET) 
        if(!decodedToken.id){
            return response.status(401).send({error : 'invalid token'})
        }
    
        const user = await User.findById(decodedToken.id)
        if(!user){
            return response.status(404).send({error : 'no user found'})
        }
        request.user = user
    }
    next()       
}

const errorHandler = (error, request, response, next) =>{
    logger.error('in error handler ', error.message)

    if(error.name === 'ValidationError'){
        return response.status(400).send({error: error.message})
    }  
}

module.exports ={errorHandler, unknownEndpoint, tokenExtractor, userExtractor}