import { useQuery } from "@apollo/client/react";
import { useState, useEffect } from "react";
import { ALL_BOOKS } from "../queries";

const Books = () => {
  const [filter, setFilter] = useState(null);
  const [genres, setGenres] = useState([]);
  const books = useQuery(ALL_BOOKS, {
    variables: { genre: filter },
  });

  useEffect(() => {
    if (!books || !books.data || filter !== null) return;

    let genres = new Set();
    books.data.allBooks.forEach((b) => {
      b.genres.forEach((g) => genres.add(g));
    });
    setGenres([...genres]);
  }, [books.data]);

  if (books.loading) {
    return <p>Loading...</p>;
  }

  return (
    <div>
      <h2>books</h2>

      <table>
        <tbody>
          <tr>
            <th></th>
            <th>author</th>
            <th>published</th>
          </tr>
          {books.data.allBooks.map((a) => (
            <tr key={a.title}>
              <td>{a.title}</td>
              <td>{a.author.name}</td>
              <td>{a.published}</td>
            </tr>
          ))}
        </tbody>
      </table>
      {[...genres].map((g) => (
        <button key={g} onClick={() => setFilter(g)}>
          {g}
        </button>
      ))}
      <button onClick={() => setFilter(null)}>all genres</button>
    </div>
  );
};

export default Books;
