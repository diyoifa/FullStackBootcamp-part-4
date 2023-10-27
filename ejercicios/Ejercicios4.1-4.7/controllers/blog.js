const blogRouter = require('express').Router()
const Blog = require('../models/blog')
const User = require('../models/user')
const userExtractor = require('../utils/middleware').userExtractor

blogRouter.get('/', async(request, response, next) => {
        try{
            const blogs = await Blog.find({}).populate('user', { username: 1, name: 1 })
            response.json(blogs)
        }catch(error){
            next(error)
        }
})

blogRouter.get('/:id', async(request, response, next) => {
    try {
        const blog = await Blog.findById(request.params.id)
        if(blog){
            response.json(blog).status(200)
        }else{
            response.status(404).end()
        }
    } catch (error) {
        next(error)
    }
})

blogRouter.post('/', userExtractor, async(request, response, next) => {
    try {
        if(!request.body.title || !request.body.url){
            response.status(400).end()
        }
        else{
            //  console.log('request.userId', request.userId)
            // console.log('hasta aqui todo bien')
            const user = await User.findById(request.userId)
            // console.log("🚀 ~ file: blog.js:34 ~ blogRouter.post ~ user:", user)

            const blog = new Blog({
                title: request.body.title,
                author: user.name,
                url: request.body.url,
                likes: request.body.likes,
                user: user._id
            })
            const savedBlog =  await blog.save()
            // console.log("🚀 ~ file: blog.js:49 ~ blogRouter.post ~ savedBlog:", savedBlog)
            user.blogs =  user.blogs.concat(savedBlog._id)
            await user.save()
            response.status(201).json(savedBlog)
        }
    } catch (error) {
        next(error)
    }
})

blogRouter.delete('/:id', userExtractor, async (request, response, next) => {
  try {

    const blogToDelete = await Blog.findById(request.params.id)
    if(blogToDelete.user.toString() !== request.userId.toString()){
        return response.status(401).json({ error: 'Unauthorized' })
    }

    const deletedBlog = await Blog.findByIdAndRemove(request.params.id)
    // console.log("🚀 ~ file: blog.js:61 ~ blogRouter.delete ~ deletedBlog:", deletedBlog)
    if (!deletedBlog) {
      return response.status(400).json({ error: 'Blog not found' })
    }
    
    response.status(204).end()
  } catch (exception) {
    next(exception)
  }
})
    
blogRouter.put('/:id', async(request, response, next) => {
    try {
     const body = request.body
     const id = request.params.id
     const updatedBlog = await Blog.findByIdAndUpdate(id, body, { new: true, runValidators: true, context: 'query' })
     response.json(updatedBlog).status(200)
    } catch (error) {
     next(error)
    }
})

module.exports = blogRouter
