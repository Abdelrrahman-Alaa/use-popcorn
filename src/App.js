import { useEffect, useState } from "react";
import StarRating from "./components/StarRating";
import { WatchedList } from "./components/WatchedList";
import { WatchedSummary } from "./components/WatchedSummary";
import { MoviesList } from "./components/MoviesList";
import { ErrorMessage } from "./components/ErrorMessage";
import { Loader } from "./components/Loader";
import { Box } from "./components/Box";
import { Main } from "./components/Main";
import { NumResults } from "./components/NumResults";
import { NavBar } from "./components/NavBar";
import { Search } from "./components/Search";
import useMovies from "./hooks/useMovies";
import useLocalStorageState from "./hooks/useLocalStorageState";
import useKey from "./hooks/useKey";
export const average = (arr) =>
  arr.reduce((acc, cur, arr) => acc + cur / arr.length, 0);

const key = process.env.REACT_APP_OMDB_API_KEY;

export default function App() {
  const [query, setQuery] = useState("");
  const [selectedId, setSelectedId] = useState(null);
  const { error, isLoading, movies } = useMovies(query);
  const [watched, setWatched] = useLocalStorageState([], "watched");

  function handleSelectedMovie(id) {
    setSelectedId((selectedId) => (id === selectedId ? null : id));
  }

  function handleCloseMovie() {
    setSelectedId(null);
  }

  function handleAddWatched(movie) {
    setWatched((watched) => [...watched, movie]);
  }

  function handleDeleteWatched(id) {
    setWatched(watched.filter((movie) => movie.imdbID !== id));
  }

  return (
    <>
      <NavBar>
        <Search
          query={query}
          setQuery={setQuery}
          closeMovie={handleCloseMovie}
        />
        <NumResults movies={movies} />
      </NavBar>
      <Main>
        <Box>
          {isLoading && <Loader />}
          {!isLoading && !error && (
            <MoviesList movies={movies} onSelectMovie={handleSelectedMovie} />
          )}
          {error && <ErrorMessage message={error} />}
        </Box>
        <Box>
          {selectedId ? (
            <MovieDetails
              id={selectedId}
              onCloseMovie={handleCloseMovie}
              onAddWatched={handleAddWatched}
              watched={watched}
            />
          ) : (
            <>
              <WatchedSummary watched={watched} />
              <WatchedList
                watched={watched}
                onDeleteWatched={handleDeleteWatched}
              />
            </>
          )}
        </Box>
      </Main>
    </>
  );
}

function MovieDetails({ id, onCloseMovie, onAddWatched, watched }) {
  const [userRating, setUserRating] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const [movie, setMovie] = useState({});
  const isWatched = watched.some((movie) => movie.imdbID === id);
  const DEFAULT_TITLE = document.title;
  const watchedUserRating = watched.find(
    (movie) => movie.imdbID === id,
  )?.userRating;

  const {
    Title: title,
    Year: year,
    Poster: poster,
    Runtime: runtime,
    imdbRating,
    Plot: plot,
    Released: released,
    Actors: actors,
    Director: director,
    Genre: genre,
  } = movie;

  function handleAdd() {
    const newWatchedMovie = {
      imdbID: id,
      year,
      poster,
      title,
      imdbRating: Number(imdbRating),
      runtime: Number(runtime.split(" ").at(0)),
      userRating,
    };
    onAddWatched(newWatchedMovie);
    onCloseMovie();
  }

  useKey("Escape", onCloseMovie);

  useEffect(() => {
    async function getMovieDetails() {
      setIsLoading(true);
      const res = await fetch(`http://www.omdbapi.com/?apikey=${key}&i=${id}`);

      if (!res.ok)
        throw new Error(`Something went wrong. Status: ${res.status}`);

      const data = await res.json();
      setMovie(data);
      setIsLoading(false);

      if (data.Response === "False") throw new Error(data.Error);
    }

    getMovieDetails();
  }, [id]);

  useEffect(() => {
    if (!title) {
      return;
    }
    document.title = `Movie | ${title}`;
    return () => {
      document.title = DEFAULT_TITLE;
    };
  }, [title, DEFAULT_TITLE]);

  return (
    <div className="details">
      {isLoading ? (
        <Loader />
      ) : (
        <>
          <header>
            <button className="btn-back" onClick={onCloseMovie}>
              &larr;
            </button>
            <img src={poster} alt={`Poster of ${title} movie`} />
            <div className="details-overview">
              <h2>{title}</h2>
              <p>
                {released} &bull; {runtime}
              </p>
              <p>
                <span>⭐</span>
                {imdbRating} IMDB Rating
              </p>
            </div>
          </header>
          <section>
            <div className="rating">
              {!isWatched ? (
                <>
                  <StarRating
                    maxRating={10}
                    size={24}
                    onSetRating={setUserRating}
                  />
                  {userRating > 0 && (
                    <button onClick={handleAdd} className="btn-add">
                      + Add to list
                    </button>
                  )}
                </>
              ) : (
                <p>You rated this movie with {watchedUserRating} stars</p>
              )}
            </div>
            <p>
              <em>{plot}</em>
            </p>
            <p>Starring by {actors}</p>
            <p>Directed by {director}</p>
          </section>
        </>
      )}
    </div>
  );
}
