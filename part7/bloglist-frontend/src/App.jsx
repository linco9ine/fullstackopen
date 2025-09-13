import { BrowserRouter as Router, Routes, Route, Link } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { Button, AppBar, Box, Typography } from "@mui/material";
import ToolBar from "@mui/material/Toolbar";
import Home from "./components/Home";
import Users from "./components/Users";
import UserBlogs from "./components/UserBlogs";
import BlogDetail from "./components/BlogDetail";

const App = () => {
  const user = useSelector((state) => state.users.user);
  const dispatch = useDispatch();

  const handleLogout = () => {
    window.localStorage.removeItem("loggedUser");
    dispatch({
      type: "USER",
      payload: {},
    });
  };

  return (
    <Router>
      {user?.token && (
        <>
          <AppBar>
            <ToolBar>
              <Box>
                <Button color="inherit" component={Link} to="/">
                  blogs{" "}
                </Button>
                <Button color="inherit" component={Link} to="/users">
                  users{" "}
                </Button>
                <Typography
                  color="inherit"
                  component="span"
                  sx={{ flexGrow: 1, ml: 40 }}
                >
                  {user?.name} logged in{" "}
                </Typography>
                <Button
                  onClick={handleLogout}
                  variant="contained"
                  color="primary"
                >
                  logout
                </Button>
              </Box>
            </ToolBar>
          </AppBar>
          <ToolBar />
        </>
      )}
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/users" element={<Users />} />
        <Route path="/users/:id" element={<UserBlogs />} />
        <Route path="/blogs/:id" element={<BlogDetail />} />
      </Routes>
    </Router>
  );
};

export default App;
