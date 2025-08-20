const _ = require('lodash')

const dummy = (blogs) => {
  return 1
}

const totalLikes = (blogs) => {
  return blogs.length === 0 ? 0 : blogs.reduce((sum, blog) => sum + blog.likes, 0)
}

const favoriteBlog = (blogs) => {
  return blogs.length === 0 ? null : blogs.slice().sort((a, b) => b.likes - a.likes)[0]
}

const mostBlogs = (blogs) => {

  // Using vanilla JavaScript
  /*const authors = {}
  blogs.forEach((blog) => {
    if (!(blog.author in authors)) {
      authors[blog.author] = 1
    } else {
      authors[blog.author] = authors[blog.author] + 1
    }
  })

  return {
    author: Object.keys(authors)[Object.values(authors).indexOf(Math.max(...Object.values(authors)))],
    blogs: Math.max(...Object.values(authors))
  }*/
  
  if (blogs.length === 0) return null

  // Using Lodash lib
  const authors = _.countBy(blogs, 'author')
  const maxBlogs = _.max(Object.values(authors))
  const author = _.findKey(authors, count => count === maxBlogs)

  return {
    author,
    blogs: maxBlogs
  }
}

const mostLikes = (blogs) => {
  if (!blogs.length) return null

  const likesByAuthor = _.mapValues(
    _.groupBy(blogs, 'author'),
    authorBlogs => _.sumBy(authorBlogs, 'likes')
  )

  const author = _.maxBy(Object.keys(likesByAuthor), a => likesByAuthor[a])
  const maxLikes = likesByAuthor[author]

  return { author, likes: maxLikes }
}


module.exports = {
  dummy,
  totalLikes,
  favoriteBlog,
  mostBlogs,
  mostLikes
}
