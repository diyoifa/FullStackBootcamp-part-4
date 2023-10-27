const userRouter = require('express').Router()
const User = require('../models/user')
const bcrypt = require('bcrypt')


userRouter.get('/', async(request, response, next)=>{
    try {
        const users = await User.find({}).populate('blogs', {url: 1, title: 1, author: 1})
        // console.log("🚀 ~ file: user.js:9 ~ userRouter.get ~ users:", users)
        response.status(200).json(users)
    } catch (error) {
        next(error)
    }
})

userRouter.post('/', async(request, response, next)=>{
    try {
        const body = request.body
        console.log("🚀 ~ file: user.js:18 ~ userRouter.post ~ body:", body)
        console.log('hasta aqui todo bien')
        
    if(!body.username){
        return response.status(400).json({error: 'username is required'}).end()
    }
    if(!body.password){
        return response.status(400).json({error: 'password is required'})
    }

    if(body.password.length<3){
        return response.status(400).json({error: 'password too short'})
    }

    if(body.username.length<3){
        return response.status(400).json({error: 'username too short'})
    }

    const saltRounds = 10
    const passwordHash = await bcrypt.hash(body.password, saltRounds)

    const user = new User({
        username: body.username,
        name: body.name,
        passwordHash
    })
    const savedUser = await user.save()
    response.status(201).json(savedUser)
    
    } catch (error) {
        next(error)
    }
})

module.exports = userRouter

