const Blog = require('../models/blog')
const User = require('../models/user')

const initialBlogs = [
    {
        title: "coding",
        // author: "test",
        url: "https://localhost:3001/api/blog",
        likes: 548124,
        // userId: '653a4f426c74d6e4578c7c5c'
    },
    {
        title: "coding is passion",
        // author: "tes2",
        url: "https://localhost:3001/api/blog",
        likes: 548124,
        // userId:'653a4f426c74d6e4578c7c60'
    },
]

const initialUsers = [
    {
        username: "test",
        name: "test",
        password: "test"
    },
    {
        username: "test2",
        name: "test2",
        password: "test2"
    }
]


const nonExistingId = async()=>{
    const newBlog = new Blog({
        title: "coding is my life i love it",
        author: "gregorio cardona",
        url: "https://localhost:3001/api/blog",
        likes: 548124,
    })

    await newBlog.save()
    await newBlog.remove()
    return newBlog._id.toString()
}

const blogsInDb = async () => {
    const notes = await Blog.find({})
    return notes.map(note => note.toJSON())
  }

const usersInDb = async()=>{
    const users = await User.find({})
    return users.map(user=>user.toJSON())
}

module.exports = {
    initialBlogs,
    blogsInDb,
    nonExistingId,
    initialUsers,
    usersInDb
}