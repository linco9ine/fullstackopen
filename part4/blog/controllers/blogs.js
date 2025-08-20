const router = require('express').Router()
const Blog = require('../models/blog')
const User = require('../models/user')
const { userExtractor } = require('../utils/middleware')
const jwt = require('jsonwebtoken')

router.get('/', async (re, response) => {
  const blogs = await Blog.find({}).populate('user', '-blogs')
  response.json(blogs)
})

router.post('/', userExtractor, async (request, response) => {
  const body = request.body
  const user = request.user

  if (!user) {
    return res.status(400).json({ error: "UserId missing or not valid" })
  }

  request.body.likes = request.body.likes ? request.body.likes : 0

  if (!request.body.title || !request.body.url) {
    return response.status(400).end()
  }
  
  const blog = new Blog({ ...request.body, user: user.id })

  const result = await blog.save()
  user.blogs.push(result._id)

  await user.save()

  response.status(201).json(result)
})

router.delete('/:id', userExtractor, async (request, response) => {
  const user = request.user

  if (!user) {
    return res.status(400).json({ error: "UserId missing or not valid" })
  }

  const id = request.params.id
  const blogToDelete = await Blog.findById(id)

  if (!blogToDelete) {
    return response.status(404).json({ error: "Blog not found"})
  }


  if (!user.blogs.some(blogId => blogId.toString() === id)) {
    return response.status(401).json({ error: "unauthorized" })
  }

  await Blog.findByIdAndDelete(id)

  response.status(204).end()
})

router.put('/:id', async (request, response) => {
  const id = request.params.id

  if (request.body.likes === undefined) {
    return response.status(400).json({ error: "'likes' field missing" })
  }

  const blog = await Blog.findById(id)
  if (!blog) {
    return response.status(404).json({ error: "Blog not found" })
  }
  blog.likes = request.body.likes
  const updatedBlog = await blog.save()

  response.json(updatedBlog)
})

module.exports = router
