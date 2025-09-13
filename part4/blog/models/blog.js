const mongoose = require("mongoose");

const blogSchema = mongoose.Schema({
  title: String,
  author: String,
  user: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  url: String,
  likes: Number,
  comments: [{ text: String }],
});

blogSchema.set("toJSON", {
  transform: (doc, ret) => {
    ret.id = ret._id.toString();
    ret.comments = ret.comments.map((comment) => ({
      id: comment._id.toString(),
      text: comment.text,
    }));
    delete ret._id;
    delete ret.comments._id;
    delete ret.__v;
    return ret;
  },
});

const Blog = mongoose.model("Blog", blogSchema);

module.exports = Blog;
