const { test, after, beforeEach, describe } = require('node:test')
const assert = require('node:assert')
const Blog = require('../models/blog')
const User = require('../models/user')
const mongoose = require('mongoose')
const supertest = require('supertest')
const app = require('../app')
const bcrypt = require('bcrypt')

const api = supertest(app)

const initialBlogs = [
  {
    title: "React patterns",
    author: "Michael Chan",
    url: "https://reactpatterns.com/",
    likes: 7
  },
  {
    title: "Go To Statement Considered Harmful",
    author: "Edsger W. Dijkstra",
    url: "http://www.u.arizona.edu/~rubinson/copyright_violations/Go_To_Considered_Harmful.html",
    likes: 5,
  }
]

const initialUsers = [
  {
    name: "samuel",
    username: "sam55",
    password: "samgtrbevneyncbyn1234"
  },
  {
    name: "johnatan",
    username: "john44",
    password: "jrunryumrymtuyjguohnuvyn1234"
  }
]

beforeEach(async () => {
  await User.deleteMany({})
  await Blog.deleteMany({})

  const user1 = await new User({
    name: initialUsers[0].name,
    username: initialUsers[0].username,
    passwordHash: await bcrypt.hash(initialUsers[0].password, 10)
  }).save()

  const blog1 = await new Blog({ ...initialBlogs[0], user: user1.id }).save()
  user1.blogs.push(blog1.id)
  await user1.save()

  const user2 = await new User({
    name: initialUsers[1].name,
    username: initialUsers[1].username,
    passwordHash: await bcrypt.hash(initialUsers[1].password, 10)
  }).save()

  const blog2 = await new Blog({ ...initialBlogs[1], user: user2.id }).save()
  user2.blogs.push(blog2.id)
  await user2.save()
})

test('blogs are returned as json', async () => {
  const blogs = await api
    .get('/api/blogs')
    .expect(200)
    .expect('Content-Type', /application\/json/)

  assert.strictEqual(blogs.body.length, initialBlogs.length)
})

test("The identifying field of the returned blogs should be 'id'", async () => {
  const blogs = await api
    .get('/api/blogs')
  
  assert.ok(blogs.body[0].hasOwnProperty('id'))
  assert.ok(blogs.body[1].hasOwnProperty('id'))
})

test('a valid blog can be added', async () => {
  const newBlog = {
    title: "Canonical string reduction",
    author: "Edsger W. Dijkstra",
    url: "http://www.cs.utexas.edu/~EWD/transcriptions/EWD08xx/EWD808.html",
    likes: 12,
  }

  const response = await api
    .post('/api/login')
    .send(initialUsers[0])

  const token = response.body.token
  await api
    .post('/api/blogs')
    .set('Authorization', `Bearer ${token}`)
    .send(newBlog)
    .expect(201)
    .expect('Content-Type', /application\/json/)

  const blogs = await api.get('/api/blogs')
  const titles = blogs.body.map(blog => blog.title)

  assert.strictEqual(blogs.body.length, initialBlogs.length + 1)
  assert.ok(titles.includes("Canonical string reduction"))
})

test("if 'likes' field is not given its value should be set to 0", async () => {
  const newBlog = {
    title: "Canonical string reduction",
    author: "Edsger W. Dijkstra",
    url: "http://www.cs.utexas.edu/~EWD/transcriptions/EWD08xx/EWD808.html",
  }

  const response = await api
    .post('/api/login')
    .send(initialUsers[0])

  const token = response.body.token

  const addedBlog = await api
    .post('/api/blogs')
    .set('Authorization', `Bearer ${token}`)
    .send(newBlog)

  assert.strictEqual(addedBlog.body.likes, 0)
})

test('if title or url is missing then it is a bad request', async () => {
  const response = await api
    .post('/api/login')
    .send(initialUsers[0])

  const token = response.body.token
  const newBlogWithoutURL = {
    title: "Canonical string reduction",
    author: "Edsger W. Dijkstra",
    likes: 12,
  }

  const newBlogWithoutTitle = {
    author: "Edsger W. Dijkstra",
    likes: 12,
    url: "http://www.cs.utexas.edu/~EWD/transcriptions/EWD08xx/EWD808.html"
  }

  await api
    .post('/api/blogs')
    .set('Authorization', `Bearer ${token}`)
    .send(newBlogWithoutURL)
    .expect(400)

  await api
    .post('/api/blogs')
    .set('Authorization', `Bearer ${token}`)
    .send(newBlogWithoutTitle)
    .expect(400)
})

describe('deletion of a blog', () => {
  test('succeeds with status code 204 if id is valid', async () => {
    const blogsAtStart = await Blog.find({})
    const blogToDelete = blogsAtStart[0]
    const id = blogToDelete._id.toString()

    const response = await api
      .post('/api/login')
      .send(initialUsers[0])

    const token = response.body.token

    await api
      .delete(`/api/blogs/${id}`)
      .set('Authorization', `Bearer ${token}`)
      .expect(204)

    const blogsAtEnd = await Blog.find({})
    const titles = blogsAtEnd.map(blog => blog.title)

    assert(!titles.includes(blogToDelete.title))
    assert.strictEqual(blogsAtEnd.length, blogsAtStart.length - 1)
  })
})

describe('update a blog', () => {
  test('if the like field is given it updates the document to the new document', async () => {
    const blogsAtStart = await Blog.find({})
    const blogToUpdate = blogsAtStart[0].toJSON()
    const id = blogToUpdate.id
    blogToUpdate.likes = 100

    const updatedBlog = await api
      .put(`/api/blogs/${id}`)
      .send(blogToUpdate)
      .expect(200)
    
    assert.strictEqual(updatedBlog.body.likes, 100)
  })

  test("it is a bad request if 'likes' field is missing", async () => {
    const blogsAtStart = await Blog.find({})
    const blogToUpdate = blogsAtStart[0].toJSON()
    const id = blogToUpdate.id

    delete blogToUpdate.likes

    const updatedBlog = await api
    .put(`/api/blogs/${id}`)
    .send(blogToUpdate)
    .expect(400)
  })
})

test('adding a blog without a token is unauthorized', async () => {
  const newBlog = {
    title: "Canonical string reduction",
    author: "Edsger W. Dijkstra",
    url: "http://www.cs.utexas.edu/~EWD/transcriptions/EWD08xx/EWD808.html",
    likes: 12,
  }

  await api
    .post('/api/blogs')
    .send(newBlog)
    .expect(401)
})


after(async () => {
  await mongoose.connection.close()
})
