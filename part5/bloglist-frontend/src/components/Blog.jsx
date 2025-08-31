import { useState, useEffect } from 'react'

const Blog = ({ handdleUpdate, handdleDelete, blog }) => {
  const [showMore, setShowMore] = useState(false)
  const [user, setUser] = useState(null)

  useEffect(() => {
    const loggedUser = window.localStorage.getItem('loggedUser')
    if (loggedUser) {
      setUser(JSON.parse(loggedUser))
    }
  }, [])

  const blogStyle = {
    paddingTop: 10,
    paddingLeft: 2,
    border: 'solid',
    borderWidth: 1,
    marginBottom: 5
  }

  return (
    <div style={blogStyle}>
      <p>{blog.title} {blog.author}
        <button onClick={() => setShowMore(!showMore)}>{showMore ? 'hide' : 'view'}</button>
      </p>

      {showMore && (
        <>
          <a href={blog.url}>{blog.url}</a>
          <p>likes {blog.likes}
            <button onClick={() => handdleUpdate(blog)}>like</button>
          </p>
          <p>{blog.user.name}</p>
          {user && user.username === blog.user.username && (
            <button
              style={{ backgroundColor: 'blue', fontWeight: 'bold', border: 'none', borderRadius: '5px' }}
              onClick={() => handdleDelete(blog)}>remove</button>
          )}
        </>
      )
      }
    </div>
  )
}

export default Blog
