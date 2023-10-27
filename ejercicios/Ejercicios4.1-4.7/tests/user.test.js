const app = require('../app')
const supertest = require('supertest')
const User = require('../models/user')
const mongoose = require('mongoose')
const bcrypt = require('bcrypt')
const api = supertest(app)
const helper = require('./test_helper')

// const initialUsers = [
//     {
//         username: "test",
//         name: "test",
//         password: "test"
//     },
//     {
//         username: "test2",
//         name: "test2",
//         password: "test2"
//     }
// ]

const hash = async(password)=>{
    return await bcrypt.hash(password, 10)
}

// const usersInDb = async()=>{
//     const users = await User.find({})
//     return users.map(user=>user.toJSON())
// }

//limpiar la base de datos antes de cada test y agregar los usuarios iniciales
beforeEach(async()=>{
    await User.deleteMany({})
    for(let user of helper.initialUsers){
        let passwordHash = await hash(user.password)
        let userObject = new User({
            username: user.username,
            name: user.name,
            passwordHash
        })
        await userObject.save()
    }
}, 100000)

describe('when creating one user at db', ()=>{
    test('creation succeeds with a fresh username', async()=>{
        const usersAtStart = await helper.usersInDb()
        const newUser = {
            username: "test3",
            name: "test3",
            password: "test3"
        }
        await api.post('/api/users').send(newUser).expect(201).expect('Content-Type', /application\/json/)
        
        const usersAtEnd = await helper.usersInDb()
        expect(usersAtEnd).toHaveLength(usersAtStart.length+1)

        const usernames = usersAtEnd.map(user=>user.username)
        expect(usernames).toContain(newUser.username)
    })
    test('creation fails with proper statuscode and message if username already taken', async()=>{
        const usersAtStart = await helper.usersInDb()
        const newUser = {
            username: "test",
            name: "test",
            password: "test"
        }
        const result = await api.post('/api/users').send(newUser).expect(400).expect('Content-Type', /application\/json/)
        console.log("🚀 ~ file: user.test.js:71 ~ test.only ~ result.body.error:", result.body.error)
        
        expect(result.body.error).toContain('expected `username` to be unique')
        const usersAtEnd = await await helper.usersInDb()
        expect(usersAtEnd).toHaveLength(usersAtStart.length)
    }, )
    test('creation fails with proper statuscode and message if password is too short', async()=>{
        const usersAtStart = await helper.usersInDb()
        const newUser = {
            username: "test3",
            name: "test3",
            password: "te"
        }
        const result = await api.post('/api/users').send(newUser).expect(400).expect('Content-Type', /application\/json/)
        expect(result.body.error).toContain('password too short')
        const usersAtEnd = await helper.usersInDb()
        expect(usersAtEnd).toHaveLength(usersAtStart.length)
    })
    test('creation fails with proper statuscode and message if username is too short', async()=>{
        const usersAtStart = await helper.usersInDb()
        const newUser = {
            username: "te",
            name: "test3",
            password: "test3"
        }
        const result = await api.post('/api/users').send(newUser).expect(400).expect('Content-Type', /application\/json/)
        expect(result.body.error).toContain('username too short')
        const usersAtEnd = await helper.usersInDb()
        expect(usersAtEnd).toHaveLength(usersAtStart.length)
    })
    test.only('creation fails with proper statuscode and message if username is missing', async()=>{
        const usersAtStart = await helper.usersInDb()
        const newUser = {
            name: "test3",
            password: "test3"
        }
        const result = await api.post('/api/users').send(newUser).expect(400).expect('Content-Type', /application\/json/)
         expect(result.body.error).toContain('username is required')
        const usersAtEnd = await helper.usersInDb()
        expect(usersAtEnd).toHaveLength(usersAtStart.length)
    })
    test.only('creation fails with proper statuscode and message if password is missing', async()=>{
        const usersAtStart = await helper.usersInDb()
        const newUser = {
            username: "test3",
            name: "test3",
        }
        const result = await api.post('/api/users').send(newUser).expect(400).expect('Content-Type', /application\/json/)
    
        expect(result.body.error).toContain('password is required')
        const usersAtEnd = await helper.usersInDb()
        expect(usersAtEnd).toHaveLength(usersAtStart.length)
    })
    test('creation fails with proper statuscode and message if username is repeated', async()=>{
        const usersAtStart = await helper.usersInDb()
        const newUser = {
            username: "test",
            name: "test3",
            password: "test3"
        }
        const result = await api.post('/api/users').send(newUser).expect(400).expect('Content-Type', /application\/json/)
        expect(result.body.error).toContain('expected `username` to be unique')
        const usersAtEnd = await helper.usersInDb()
        expect(usersAtEnd).toHaveLength(usersAtStart.length)
    })
})

describe('when getting users', ()=>{
    test.only('users are returned as json', async()=>{
        const res = await api.get('/api/users').expect(200).expect('Content-Type', /application\/json/)
        expect(res.body).toHaveLength(initialUsers.length)
    })
})



afterAll(()=>{
    mongoose.connection.close()
})