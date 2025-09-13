import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { ListItem, ListItemText } from "@mui/material";

const Blog = ({ blog }) => {
  const [showMore, setShowMore] = useState(false);
  const [user, setUser] = useState(null);

  useEffect(() => {
    const loggedUser = window.localStorage.getItem("loggedUser");
    if (loggedUser) {
      setUser(JSON.parse(loggedUser));
    }
  }, []);

  return (
    <ListItem
      sx={{
        bgcolor: "primary.light",
        borderRadius: 1,
        "&:hover": { bgcolor: "primary.main" },
      }}
    >
      <Link to={`/blogs/${blog.id}`} style={{ textDecoration: "none" }}>
        <ListItemText primary={`${blog.title} ${blog.author}`} />
      </Link>
    </ListItem>
  );
};

export default Blog;
