const router = require("express").Router();
const Blog = require("../models/blog");
const User = require("../models/user");
const { userExtractor } = require("../utils/middleware");
const jwt = require("jsonwebtoken");

router.get("/", async (re, response) => {
  const blogs = await Blog.find({}).populate("user", "-blogs");
  response.json(blogs);
});

router.post("/", userExtractor, async (request, response) => {
  const body = request.body;
  const user = request.user;

  if (!user) {
    return response.status(400).json({ error: "UserId missing or not valid" });
  }

  request.body.likes = request.body.likes ? request.body.likes : 0;

  if (!request.body.title || !request.body.url) {
    return response
      .status(400)
      .json({ error: "title and url must be provided" });
  }

  const blog = new Blog({ ...request.body, user: user.id, comments: [] });

  const result = await blog.save();
  user.blogs.push(result._id);

  await user.save();

  response.status(201).json(result);
});

router.delete("/:id", userExtractor, async (request, response) => {
  const user = request.user;

  if (!user) {
    return res.status(400).json({ error: "UserId missing or not valid" });
  }

  const id = request.params.id;
  const blogToDelete = await Blog.findById(id);

  if (!blogToDelete) {
    return response.status(404).json({ error: "Blog not found" });
  }

  if (!user.blogs.some((blogId) => blogId.toString() === id)) {
    return response.status(401).json({ error: "unauthorized" });
  }

  await Blog.findByIdAndDelete(id);

  response.status(204).end();
});

router.put("/:id", async (request, response) => {
  const id = request.params.id;

  if (request.body.likes === undefined) {
    return response.status(400).json({ error: "'likes' field missing" });
  }

  const blog = await Blog.findById(id);
  if (!blog) {
    return response.status(404).json({ error: "Blog not found" });
  }
  blog.likes = request.body.likes;
  const updatedBlog = await blog.save();

  response.json(updatedBlog);
});

router.post("/:id/comments", userExtractor, async (req, res) => {
  const user = req.user;
  if (!user) {
    return res.status(401).json({ error: "Unauthorized" });
  }

  const id = req.params.id;

  const blog = await Blog.findById(id);
  if (!blog) {
    return res.status(404).json({ error: "Blog not found" });
  }

  if (!req.body.comment) {
    return res.status(400).json({ error: "'comment' must be provided" });
  }

  blog.comments.push({ text: req.body.comment });

  const updatedBlog = await blog.save();

  res.status(201).json(updatedBlog);
});

module.exports = router;
