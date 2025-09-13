import { useParams, useNavigate } from "react-router-dom";
import { useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { List, ListItem, ListItemText } from "@mui/material";
import userServices from "../services/users";

const UserBlogs = () => {
  const loggedInUser = window.localStorage.getItem("loggedUser");
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { id } = useParams();
  const userWithBlogs = useSelector((state) =>
    state.users.users.find((user) => user.id === id)
  );
  const user = useSelector((state) => state.users.user);

  const handleLogout = () => {
    window.localStorage.removeItem("loggedUser");
    navigate("/");
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

      userServices.getAll().then((users) => {
        dispatch({
          type: "USERS",
          payload: users,
        });
      });
    }
  }, []);

  return (
    <>
      {userWithBlogs && (
        <>
          <h1>{userWithBlogs.name}</h1>
          <h3>added blogs</h3>
          <List>
            {userWithBlogs.blogs.length > 0 ? (
              userWithBlogs.blogs.map((blog) => (
                <ListItem
                  key={blog.key}
                  sx={{ bgcolor: "primary.light", mb: 1 }}
                >
                  <ListItemText primary={blog.title} />
                </ListItem>
              ))
            ) : (
              <p>
                <i>No blog added yet!</i>
              </p>
            )}
          </List>
        </>
      )}
    </>
  );
};

export default UserBlogs;
