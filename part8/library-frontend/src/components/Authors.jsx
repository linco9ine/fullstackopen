import { useQuery } from "@apollo/client/react";
import { ALL_AUTHORS } from "../queries";
import AuthorBirthYearForm from "./AuthorBirthYearForm";

const Authors = () => {
  const authors = useQuery(ALL_AUTHORS);

  if (authors.loading) {
    return <p>Loading...</p>;
  }

  return (
    <div>
      <h2>authors</h2>
      <table>
        <tbody>
          <tr>
            <th></th>
            <th>born</th>
            <th>books</th>
          </tr>
          {authors?.data?.allAuthors?.map((a) => (
            <tr key={a?.id}>
              <td>{a?.name}</td>
              <td>{a?.born}</td>
              <td>{a?.bookCount}</td>
            </tr>
          ))}
        </tbody>
      </table>

      <AuthorBirthYearForm authors={authors.data.allAuthors} />
    </div>
  );
};

export default Authors;
