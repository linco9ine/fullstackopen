import { useState } from "react";
import { useMutation } from "@apollo/client/react";
import { EDIT_AUTHOR, ALL_AUTHORS } from "../queries";

const AuthorBirthYearForm = ({ authors }) => {
  const [author, setAuthor] = useState(authors[0]?.name);
  const [born, setBorn] = useState("");
  const [updateAuthor] = useMutation(EDIT_AUTHOR, {
    refetchQueries: [{ query: ALL_AUTHORS }],
  });

  const handleSubmit = (event) => {
    event.preventDefault();

    updateAuthor({ variables: { name: author, setBornTo: Number(born) } });

    setAuthor(authors[0]?.name);
    setBorn("");
  };

  return (
    <>
      <h3>Set Birth Year</h3>
      <form onSubmit={handleSubmit}>
        <div>
          <select
            value={author}
            onChange={(event) => setAuthor(event.target.value)}
          >
            {authors.map((a) => (
              <option value={a.name} key={a.id}>
                {a.name}
              </option>
            ))}
          </select>
        </div>

        <div>
          born:{" "}
          <input
            value={born}
            onChange={(event) => setBorn(event.target.value)}
          />
        </div>

        <button type="submit">update author</button>
      </form>
    </>
  );
};

export default AuthorBirthYearForm;
