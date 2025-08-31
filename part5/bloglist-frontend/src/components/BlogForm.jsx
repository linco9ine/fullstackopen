import { useState } from 'react'
import blogService from '../services/blogs'

const BlogForm = ({ blogs, setBlogs, setMessage, setShowBlogForm, setErrorMessage, createBlog }) => {
  const [title, setTitle] = useState('')
  const [author, setAuthor] = useState('')
  const [url, setUrl] = useState('')
  const loggedUser = window.localStorage.getItem('loggedUser')
  const user = JSON.parse(loggedUser)

  const handleBlogSubmit = async (event) => {
    event.preventDefault()
    const blog = { title, author, url }
    try {
      await createBlog(blog)

      setTitle('')
      setAuthor('')
      setUrl('')

      setShowBlogForm(false)
    } catch (err) {
      console.log(err)
    }
  }

  return (
    <>
      <h1>create new</h1>
      <form onSubmit={handleBlogSubmit}>
        <div>
          <label>
            title:
            <input type='text' value={title} onChange={({ target }) => setTitle(target.value)} placeholder='title' />
          </label>
        </div>

        <div>
          <label>
            author:
            <input type='text' value={author} onChange={({ target }) => setAuthor(target.value)} placeholder='author' />
          </label>
        </div>

        <div>
          <label>
            url:
            <input type='text' value={url} onChange={({ target }) => setUrl(target.value)} placeholder='url' />
          </label>
        </div>

        <button type='submit'>create</button>
        <button type='button' onClick={() => setShowBlogForm(false)}>cancel</button>
      </form>
    </>
  )
}

export default BlogForm
