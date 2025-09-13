import { useState } from "react";
import { useDispatch } from "react-redux";
import { Button, Typography, TextField } from "@mui/material";
import blogService from "../services/blogs";

const BlogForm = ({ blogs, setShowBlogForm, newBlog, setNewBlog }) => {
  const dispatch = useDispatch();

  const [title, setTitle] = useState("");
  const [author, setAuthor] = useState("");
  const [url, setUrl] = useState("");
  const loggedUser = window.localStorage.getItem("loggedUser");
  const user = JSON.parse(loggedUser);

  const handleBlogSubmit = async (event) => {
    event.preventDefault();
    const blog = { title, author, url };
    try {
      await blogService.create(blog);

      setNewBlog(!newBlog);

      dispatch({
        type: "NOTIFICATION",
        payload: {
          msg: `a new blog ${blog.title} by ${blog.author} added`,
        },
      });
      setTimeout(() => {
        dispatch({
          type: "NOTIFICATION",
          payload: { msg: "" },
        });
      }, 4000);

      setTitle("");
      setAuthor("");
      setUrl("");

      setShowBlogForm(false);
    } catch (err) {
      dispatch({
        type: "NOTIFICATION",
        payload: { msg: err.response.data.error, whatIsIt: "error" },
      });

      setTimeout(() => {
        dispatch({
          type: "NOTIFICATION",
          payload: { msg: "" },
        });
      }, 4000);

      console.log(err);
    }
  };

  return (
    <>
      <Typography variant="h5">create new</Typography>
      <form onSubmit={handleBlogSubmit}>
        <div>
          <TextField
            label="Title"
            size="small"
            type="text"
            sx={{ mb: 1 }}
            fullWidth
            value={title}
            onChange={({ target }) => setTitle(target.value)}
            placeholder="title"
          />
        </div>

        <div>
          <TextField
            label="Author"
            size="small"
            type="text"
            sx={{ mb: 1 }}
            fullWidth
            value={author}
            onChange={({ target }) => setAuthor(target.value)}
            placeholder="author"
          />
        </div>

        <div>
          <TextField
            label="Url"
            size="small"
            type="text"
            fullWidth
            value={url}
            onChange={({ target }) => setUrl(target.value)}
            placeholder="url"
          />
        </div>

        <Button
          variant="contained"
          type="submit"
          size="small"
          color="success"
          sx={{ mt: 1, mb: 6 }}
        >
          create
        </Button>
        <Button
          sx={{ mt: 1, ml: 1, mb: 6 }}
          color="warning"
          size="small"
          variant="contained"
          type="button"
          onClick={() => setShowBlogForm(false)}
        >
          cancel
        </Button>
      </form>
    </>
  );
};

export default BlogForm;
