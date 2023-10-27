const app  = require('../app')
const supertest = require('supertest')
const mongoose =  require('mongoose')
const api = supertest(app)


describe('when user is loging', ()=>{
    test('login with correct credentials return status 200 and token', async()=>{
        const user = {
            username: 'test',
            password: 'test'
        }
       const res = await api.post('/api/login').send(user).expect(200)
       
    //    expect(res.body).toContain('token')
    })
    test('login with incorrect credentials return status 401', async()=>{
        const user = {
            username: 'test',
            password: 'test2'
        }
       const res = await api.post('/api/login').send(user).expect(401)
       expect(res.body.error).toContain('invalid user or password')
    })
})

afterAll(()=> mongoose.connection.close())