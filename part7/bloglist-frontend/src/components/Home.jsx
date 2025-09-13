import { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { Button, Typography, List } from "@mui/material";
import Blog from "./Blog";
import BlogForm from "./BlogForm";
import Notification from "./Notification";
import LoginForm from "./LoginForm";
import blogService from "../services/blogs";
import loginService from "../services/login";

const Home = () => {
  const dispatch = useDispatch();

  const blogs = useSelector((state) => state.blogs);
  const user = useSelector((state) => state.users.user);

  const [showBlogForm, setShowBlogForm] = useState(false);
  const [newBlog, setNewBlog] = useState(false);

  const handleLogout = () => {
    window.localStorage.removeItem("loggedUser");
    dispatch({
      type: "USER",
      payload: {},
    });
  };

  const handdleDelete = async (blog) => {
    const confirmDelete = window.confirm(
      `Remove blog ${blog.title} by ${blog.author}`
    );
    if (confirmDelete) {
      try {
        const res = await blogService.deleteBlog(blog);
        dispatch({
          type: "DELETE_BLOG",
          payload: blog.id,
        });
        return res;
      } catch (err) {
        console.log(err);
      }
    }
  };

  useEffect(() => {
    if (user) {
      blogService.getAll().then((blogs) =>
        dispatch({
          type: "ADD_BLOGS",
          payload: blogs,
        })
      );
    }
  }, [user, newBlog]);

  useEffect(() => {
    const loggedUser = window.localStorage.getItem("loggedUser");
    if (loggedUser) {
      const user = JSON.parse(loggedUser);
      dispatch({
        type: "USER",
        payload: user,
      });
      blogService.setToken(user.token);
    }
  }, []);

  return (
    <>
      {Object.keys(user).length === 0 ? (
        <LoginForm />
      ) : (
        <div>
          <Typography
            variant="h4"
            align="center"
            sx={{ color: "primary.main", fontWeight: "bold" }}
          >
            blog app
          </Typography>
          <Notification />
          {showBlogForm && (
            <BlogForm
              blogs={blogs}
              setShowBlogForm={setShowBlogForm}
              newBlog={newBlog}
              setNewBlog={setNewBlog}
            />
          )}
          {!showBlogForm ? (
            <Button
              size="small"
              color="info"
              variant="contained"
              sx={{ mb: 2 }}
              onClick={() => setShowBlogForm(true)}
            >
              create new blog
            </Button>
          ) : null}
          {blogs
            .slice()
            .sort((b1, b2) => b2.likes - b1.likes)
            .map((blog) => (
              <List key={blog.id}>
                <Blog blog={blog} />
              </List>
            ))}
        </div>
      )}
    </>
  );
};

export default Home;
