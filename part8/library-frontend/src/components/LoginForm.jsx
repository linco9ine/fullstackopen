import { useState, useEffect } from "react";
import { useMutation } from "@apollo/client/react";
import { useNavigate } from "react-router-dom";
import { LOGIN } from "../queries";

const LoginForm = ({ setToken }) => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [errorMessage, setErrorMessage] = useState(null);
  const navigate = useNavigate();

  const [login, result] = useMutation(LOGIN, {
    onError: (error, a) => {
      setErrorMessage(error.errors[0].message);
      setTimeout(() => {
        setErrorMessage(null);
      }, 5000);
    },
  });

  useEffect(() => {
    if (result.data) {
      const token = result.data.login.value;
      setToken(token);
      localStorage.setItem("phonenumbers-user-token", token);
      navigate("/me");
    }
  }, [result.data]);

  const onSubmit = (e) => {
    e.preventDefault();

    login({ variables: { username, password } });

    setUsername("");
    setPassword("");
  };

  return (
    <>
      <h3>Login</h3>
      <p style={{ color: "red" }}>{errorMessage ? errorMessage : null}</p>
      <form onSubmit={onSubmit}>
        <div>
          username:{" "}
          <input
            value={username}
            onChange={(e) => setUsername(e.target.value)}
          />
        </div>

        <div>
          password:{" "}
          <input
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
        </div>

        <button type="submit">login</button>
      </form>
    </>
  );
};

export default LoginForm;
