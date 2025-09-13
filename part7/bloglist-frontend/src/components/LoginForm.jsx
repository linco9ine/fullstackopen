import { useState } from "react";
import { useDispatch } from "react-redux";
import { Button, Typography, TextField } from "@mui/material";
import loginService from "../services/login";
import blogService from "../services/blogs";
import Notification from "./Notification";

const LoginForm = () => {
  const dispatch = useDispatch();

  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  const handleLogin = async (event) => {
    event.preventDefault();

    try {
      const user = await loginService.login({ username, password });
      dispatch({
        type: "USER",
        payload: user,
      });
      window.localStorage.setItem("loggedUser", JSON.stringify(user));
      blogService.setToken(user.token);

      setUsername("");
      setPassword("");
    } catch (err) {
      dispatch({
        type: "NOTIFICATION",
        payload: {
          msg: err.response.data.error,
          whatIsIt: "error",
        },
      });
      setTimeout(() => {
        dispatch({
          type: "NOTIFICATION",
          payload: { msg: "" },
        });
      }, 5000);
    }
  };

  return (
    <form onSubmit={handleLogin}>
      <Typography variant="h5" align="center" color="primary">
        Log in to application
      </Typography>
      <Notification />
      <div>
        <TextField
          label="username"
          size="small"
          fullWidth
          sx={{ mb: 1 }}
          type="text"
          value={username}
          name="Username"
          onChange={({ target }) => setUsername(target.value)}
        />
      </div>

      <div>
        <TextField
          label="password"
          size="small"
          fullWidth
          sx={{ mb: 1 }}
          type="password"
          value={password}
          name="Password"
          onChange={({ target }) => setPassword(target.value)}
        />
      </div>
      <Button variant="contained" type="submit">
        login
      </Button>
    </form>
  );
};

export default LoginForm;
