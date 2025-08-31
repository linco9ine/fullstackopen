import { useState, useEffect } from 'react'
import Blog from './components/Blog'
import BlogForm from './components/BlogForm'
import Notification from './components/Notification'
import LoginForm from './components/LoginForm'
import blogService from './services/blogs'
import loginService from './services/login'

const App = () => {
  const [blogs, setBlogs] = useState([])
  const [user, setUser] = useState(null)
  const [errorMessage, setErrorMessage] = useState(null)
  const [message, setMessage] = useState(null)
  const [showBlogForm, setShowBlogForm] = useState(false)
  const [newBlog, setNewBlog] = useState(false)

  const handleLogout = () => {
    window.localStorage.removeItem('loggedUser')
    setUser(null)
  }

  const handdleDelete = async (blog) => {
    const confirmDelete = window.confirm(`Remove blog ${blog.title} by ${blog.author}`)
    if (confirmDelete) {
      try {
        const res = await blogService.deleteBlog(blog)
        setBlogs(blogs.filter(b => b.id !== blog.id))
        return res
      } catch(err) {
        console.log(err)
      }
    }
  }

  const handdleUpdate = async (newBlog) => {
    try {
      const blog = blogs.find(b => b.id === newBlog.id)
      blog.likes = blog.likes + 1
      setBlogs(blogs.map(b => b.id === blog.id ? blog : b))
      await blogService.updateBlog(blog)
    } catch (err) {
      console.log(err)
    }
  }

  const createBlog = async (blog) => {
    try {
      await blogService.create(blog)
      setNewBlog(!newBlog)
      setMessage(`a new blog ${blog.title} by ${blog.author} added`)
      setTimeout(() => {
        setMessage(null)
      }, 4000)
    } catch (err) {
      console.log(err)
      setErrorMessage(err.response.data.error)
      setTimeout(() => {
        setErrorMessage(null)
      }, 4000)
      console.log(err)
    }
  }

  useEffect(() => {
    if (user) {
      blogService.getAll().then(blogs =>
        setBlogs( blogs )
      )
    }
  }, [user, newBlog])

  useEffect(() => {
    const loggedUser = window.localStorage.getItem('loggedUser')
    if (loggedUser) {
      const user = JSON.parse(loggedUser)
      setUser(user)
      blogService.setToken(user.token)
    }
  }, [])

  return (
    <>
      {!user && <LoginForm setUser={setUser} />}
      {user &&
        <div>
          <h2>blogs</h2>
          {message && <Notification msg={message} whatIsIt={0} />}
          {errorMessage && <Notification msg={errorMessage} whatIsIt={1} />}
          <p>{user.name} logged in <button onClick={handleLogout}>logout</button></p>
          { showBlogForm &&
            <BlogForm
              blogs={blogs}
              setBlogs={setBlogs}
              setMessage={setMessage}
              setShowBlogForm={setShowBlogForm}
              setErrorMessage={setErrorMessage}
              createBlog={createBlog}
            />
          }
          { !showBlogForm ? <button onClick={() => setShowBlogForm(true)}>create new blog</button> : null }
          {blogs
            .slice()
            .sort((b1, b2) => b2.likes - b1.likes)
            .map(blog => <Blog
              key={blog.id}
              blog={blog}
              handdleDelete={handdleDelete}
              handdleUpdate={handdleUpdate} />
            )
          }
        </div>
      }
    </>
  )
}

export default App
