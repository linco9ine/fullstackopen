const mongoose = require('mongoose')

const blogSchema = mongoose.Schema({
  title: String,
  author: String,
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User'},
  url: String,
  likes: Number,
})

blogSchema.set('toJSON', {
  transform: (doc, ret) => {
    ret.id = ret._id.toString()
    delete ret._id
    delete ret.__v
    return ret
  }
})

const Blog = mongoose.model('Blog', blogSchema)

module.exports = Blog
