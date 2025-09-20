import { useQuery } from "@apollo/client/react";
import { ME, ALL_BOOKS } from "../queries";

const Recommendation = () => {
  const me = useQuery(ME);
  const books = useQuery(ALL_BOOKS, {
    variables: { genre: me?.data?.me?.favoriteGenre },
    skip: !me.data,
  });

  if (me.loading || books.loading) {
    return <p>Loading...</p>;
  }

  return (
    <>
      <h2>recommendations</h2>
      <p>
        books in your favorite genre{" "}
        <strong>{me?.data?.me?.favoriteGenre}</strong>
      </p>
      <table>
        <thead>
          <tr>
            <th></th>
            <th>author</th>
            <th>published</th>
          </tr>
        </thead>

        <tbody>
          {books?.data?.allBooks?.map((b) => (
            <tr key={b?.id}>
              <td>{b?.title}</td>
              <td>{b?.author.name}</td>
              <td>{b?.published}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </>
  );
};

export default Recommendation;
