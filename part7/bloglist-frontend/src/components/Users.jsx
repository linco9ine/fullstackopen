import { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useNavigate, Link } from "react-router-dom";
import userServices from "../services/users";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  Paper,
  Typography,
} from "@mui/material";

const Users = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const users = useSelector((state) => state.users.users);
  const user = useSelector((state) => state.users.user);
  const loggedInUser = window.localStorage.getItem("loggedUser");

  const handleLogout = () => {
    window.localStorage.removeItem("loggedUser");
    dispatch({
      type: "USER",
      payload: {},
    });
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
      <h1>Users</h1>
      {users.length !== 0 && (
        <Paper>
          <Table size="small">
            <TableHead>
              <TableRow>
                <TableCell></TableCell>
                <TableCell>
                  <Typography>blogs created</Typography>
                </TableCell>
              </TableRow>
            </TableHead>

            <TableBody>
              {users.map((user) => (
                <TableRow key={user.id} hover>
                  <TableCell>
                    <Typography>
                      <Link
                        to={`/users/${user.id}`}
                        style={{ textDecoration: "none" }}
                      >
                        {user.name}
                      </Link>
                    </Typography>
                  </TableCell>
                  <TableCell>{user.blogs.length}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </Paper>
      )}
    </>
  );
};

export default Users;
