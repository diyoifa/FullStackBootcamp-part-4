const app = require('../app')
const supertest = require('supertest')
const Blog = require('../models/blog')
const mongoose = require('mongoose')
const api = supertest(app)
const helper = require('./test_helper')


let token = null

beforeEach(async () => {
    await Blog.deleteMany({})
    const user = {
        username: 'test',
        password: 'test'
    }
   const res = await api.post('/api/login').send(user)
   token = res.body.token
//    console.log("🚀 ~ file: blogs_api.test.js:23 ~ beforeEach ~ token:", token)
    for (let blog of helper.initialBlogs) {
        await api.post('/api/blog').send(blog).set('Authorization', `bearer ${token}`)
    }
    
}, 100000)

describe('when there is initially some blogs saved', () => {

    test('invalid id returns status code 400', async () => {
        const invalidId = '5a3d5da59070081a82a3445'
        await api
            .get(`/api/blog/${invalidId}`)
            .expect(400)
    })

    test('return the correct amount of blogs in json format', async () => {
        await api
            .get('/api/blog')
            .expect(200)
            .expect('Content-Type', /application\/json/)

        const response = await api.get('/api/blog')
        expect(response.body).toHaveLength(helper.initialBlogs.length)
    })

    test('the unique identifier property of the blog posts is named id', async () => {
        const response = await api.get('/api/blog')
        expect(response.body[0].id).toBeDefined()
    })

    // test('a valid blog can be added', async () => {
    //     const newBlog = {
    //         title: "coding is fun",
    //         author: "gregorio cardona",
    //         url: "https://localhost:3001/api/blog",
    //         likes: 588124,
    //     }
    //     //guardando post en la base de datos
    //     await api
    //         .post('/api/blog')
    //         .send(newBlog)
    //         .expect(201)
    //         .expect('Content-Type', /application\/json/)

    //     const blogsAtEnd = await api.get('/api/blog')
    //     expect(blogsAtEnd.body).toHaveLength(helper.initialBlogs.length + 1)
    //     const contents = blogsAtEnd.body.map(n => n.title)
    //     expect(contents).toContain(newBlog.title)

    // })

})

describe('adding a new blog', () => {
    test('if the likes property is missing from the request, it will default to the value 0', async () => {
        const newBlog = {
            title: "coding is amazing",
            // author: "gregorio cardona",
            url: "https://localhost:3001/api/blog",
        }
        //guardando post en la base de datos
        await api
            .post('/api/blog')
            .send(newBlog)
            .set('Authorization', `bearer ${token}`)
            .expect(201)
            .expect('Content-Type', /application\/json/)

        const blogsAtEnd = await helper.blogsInDb()
        expect(blogsAtEnd).toHaveLength(helper.initialBlogs.length + 1)
        //array de likes
        const likesValue = blogsAtEnd.map(n => n.likes)
        //verificamos que contenga el valor 0 en el array de likes
        expect(likesValue).toContain(0)
    })

    test('if the title and url properties are missing from the request data, the backend responds to the request with the status code 400 Bad Request', async () => {
        const newBlog = {
            author: "gregorio cardona",
            likes: 588124,
        }
        //guardando post en la base de datos
        await api
            .post('/api/blog')
            .send(newBlog)
            .set('Authorization', `bearer ${token}`)
            .expect(400)
    }, 100000)

    test('when a new blog is added, we save the user who added it', async () => {
        const newBlog = {
            title: "coding is love",
            url: "https://localhost:3001/api/blog",
            likes: 548124,
        }
        await api
            .post('/api/blog')
            .send(newBlog)
            .set('Authorization', `bearer ${token}`)
            .expect(201)
            .expect('Content-Type', /application\/json/)
        const blogsAtEnd = await helper.blogsInDb()
        const authors = blogsAtEnd.map(blog => blog.author)
        expect(authors).toContain('test')
    })
    test('if the token is not provided, the backend responds to the request with the status code 401 Unauthorized', async () => {
        const newBlog = {
            title: "coding is love",
            url: "https://localhost:3001/api/blog",
            likes: 548124,
        }
        await api
            .post('/api/blog')
            .send(newBlog)
            .expect(401)
    })

    test('if the token is invalid, the backend responds to the request with the status code 401 Unauthorized', async () => {
        const newBlog = {
            title: "coding is love",
            url: "https://localhost:3001/api/blog",
            likes: 548124,
        }
        await api
            .post('/api/blog')
            .send(newBlog)
            .set('Authorization', `bearer ${token}1`)
            .expect(401)
    })
})

describe('deleting a blog', () => {
    test('delete a blog succesfully', async () => {
        const blogsAtStart = await helper.blogsInDb()
        const blogToDelete = blogsAtStart[0]

        await api
            .delete(`/api/blog/${blogToDelete.id}`)
            .set('Authorization', `bearer ${token}`)
            .expect(204)

        const blogsAtEnd = await helper.blogsInDb()

        expect(blogsAtEnd).toHaveLength(
            helper.initialBlogs.length - 1
        )

        const contents = blogsAtEnd.map(r => r.title)
        expect(contents).not.toContain(blogToDelete.title)
    })

    test('delete a blog with invalid id', async () => {
        const invalidId = '5a3d5da59070081a82a3445'
        await api
            .delete(`/api/blog/${invalidId}`)
            .set('Authorization', `bearer ${token}`)
            .expect(400)
    })
})


afterAll(() => {
    mongoose.connection.close()
})