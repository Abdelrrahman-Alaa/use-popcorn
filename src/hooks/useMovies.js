import { useEffect, useState } from "react";
const key = process.env.REACT_APP_OMDB_API_KEY;

function useMovies(query) {
  const [movies, setMovies] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (query.length < 3) {
      setMovies([]);
      setError(null);
      return;
    }

    const controller = new AbortController();

    async function getMovies() {
      try {
        setIsLoading(true);
        setError(null);

        const res = await fetch(
          `http://www.omdbapi.com/?apikey=${key}&s=${query}`,
          { signal: controller.signal },
        );

        if (!res.ok)
          throw new Error(`Something went wrong. Status: ${res.status}`);

        const data = await res.json();

        if (data.Response === "False") throw new Error(data.Error);

        setMovies(data.Search);
        setError(null);
      } catch (err) {
        if (err.name !== "AbortError") {
          setError(err.message);
        }
      } finally {
        setIsLoading(false);
      }
    }

    getMovies();

    return function () {
      controller.abort();
    };
  }, [query]);

  return { movies, isLoading, error };
}

export default useMovies;
