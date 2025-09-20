import { useState, useEffect } from "react";
import { Routes, Route, Link, useNavigate } from "react-router-dom";
import { useApolloClient, useSubscription } from "@apollo/client/react";
import Authors from "./components/Authors";
import Books from "./components/Books";
import NewBook from "./components/NewBook";
import LoginForm from "./components/LoginForm";
import Recommendation from "./components/Recommendation";
import { BOOK_ADDED, ALL_BOOKS } from "./queries";

const App = () => {
  useSubscription(BOOK_ADDED, {
    onData: ({ data, client }) => {
      const bookAdded = data.data.bookAdded;

      client.cache.updateQuery(
        { query: ALL_BOOKS, variables: { genre: null } },
        (data) => {
          if (!data) return;
          return {
            allBooks: data.allBooks.concat(bookAdded),
          };
        }
      );
    },
  });

  const [token, setToken] = useState("");
  const navigate = useNavigate();
  const client = useApolloClient();

  const logout = () => {
    setToken("");
    localStorage.clear();
    navigate("/login");
  };

  useEffect(() => {
    const token = localStorage.getItem("phonenumbers-user-token");
    if (token) {
      setToken(token);
    }
  }, []);

  return (
    <>
      <div
        style={{
          border: "2px solid black",
          display: "flex",
          gap: "10px",
          padding: "10px",
          marginBottom: "20px",
        }}
      >
        <Link to="/">authors</Link>
        <Link to="/books">books</Link>
        {token && <Link to="/add_book">add book</Link>}
        {!token && <Link to="/login">login</Link>}
        {token && <Link to="/me">recommend</Link>}
        {token && <button onClick={logout}>logout</button>}
      </div>

      <Routes>
        <Route path="/" element={<Authors />} />
        <Route path="/books" element={<Books />} />
        {token && <Route path="/add_book" element={<NewBook />} />}
        {token && <Route path="/me" element={<Recommendation />} />}
        <Route path="/login" element={<LoginForm setToken={setToken} />} />
      </Routes>
    </>
  );
};

export default App;
