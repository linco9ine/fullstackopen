import { useParams, useNavigate, Link } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { useState, useEffect } from "react";
import {
  Button,
  Typography,
  TextField,
  List,
  ListItem,
  ListItemText,
} from "@mui/material";
import blogServices from "../services/blogs";

const BlogDetail = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [comment, setComment] = useState("");
  const { id } = useParams();
  const loggedInUser = window.localStorage.getItem("loggedUser");
  const user = useSelector((state) => state.users.user);
  const blog = useSelector((state) =>
    state.blogs.find((blog) => blog.id === id)
  );

  const handleLogout = () => {
    window.localStorage.removeItem("loggedUser");
    dispatch({
      type: "USER",
      payload: {},
    });
    navigate("/");
  };

  const handdleUpdate = async (blog) => {
    try {
      const updatedBlog = { ...blog, likes: blog.likes + 1 };

      dispatch({
        type: "LIKE_BLOG",
        payload: updatedBlog,
      });
      await blogServices.updateBlog(updatedBlog);
    } catch (err) {
      console.log(err);
    }
  };

  const handleCommentSubmit = async (event) => {
    event.preventDefault();
    const updatedBlog = await blogServices.addComment(id, comment);
    dispatch({
      type: "ADD_COMMENT",
      payload: updatedBlog,
    });

    setComment("");
  };

  useEffect(() => {
    if (!loggedInUser) {
      navigate("/");
    }
  }, [user]);

  useEffect(() => {
    if (loggedInUser) {
      dispatch({
        type: "USER",
        payload: JSON.parse(loggedInUser),
      });

      blogServices.getAll().then((blogs) => {
        dispatch({
          type: "ADD_BLOGS",
          payload: blogs,
        });
      });

      const user = JSON.parse(loggedInUser);
      blogServices.setToken(user.token);
    }
  }, []);

  return (
    <>
      {blog && (
        <>
          <Typography variant="h4" sx={{ mt: 2 }}>
            {blog.title}
          </Typography>

          <Typography variant="h6">
            <Link to={blog.url}>{blog.url}</Link>
          </Typography>
          <Typography variant="h6">
            {blog.likes} likes
            <Button
              variant="contained"
              size="small"
              sx={{ ml: 1 }}
              onClick={() => handdleUpdate(blog)}
            >
              like
            </Button>
          </Typography>
          <Typography>
            added by <strong>{blog.user.name}</strong>
          </Typography>
          <Typography variant="h5" sx={{ fontWeight: "bold" }}>
            comments
          </Typography>
          <form onSubmit={handleCommentSubmit}>
            <TextField
              size="small"
              value={comment}
              onChange={(event) => setComment(event.target.value)}
              placeholder="Write a comment..."
            />
            <Button variant="contained">add comment</Button>
          </form>
          <List>
            {blog.comments.length > 0 ? (
              blog.comments.map((c) => (
                <ListItem
                  key={c.id}
                  sx={{ bgcolor: "primary.light", borderRadius: 1, mb: 1 }}
                >
                  <ListItemText primary={c.text} />
                </ListItem>
              ))
            ) : (
              <p>
                <i>No comment yet!</i>
              </p>
            )}
          </List>
        </>
      )}
    </>
  );
};

export default BlogDetail;
