import Navbar from "./Navbar";
import Main from "./main";
import Search from "./Search";
import Numresults from "./Numresults";
import Box from "./Box";
import MoviesList from "./MoviesList";
import WatchedMoviesList from "./WatchedMoviesList";
import WatchedSummary from "./WatchedSummary";
import { useEffect, useState } from "react";
import Loader from "./Loader";
import ErrorMessage from "./ErrorMessage";
import MovieDetails from "./MovieDetails";

export const API_KEY = "d049f86f";

const useDebounce = (value, delay) => {
  const [debouncedValue, setDebouncedValue] = useState(value);

  useEffect(() => {
    const handler = setTimeout(() => setDebouncedValue(value), delay);

    return () => clearTimeout(handler);
  }, [value, delay]);

  return debouncedValue;
};

const App = () => {
  const [query, setQuery] = useState("");
  const [movies, setMovies] = useState([]);
  const [watched, setWatched] = useState(
    () => JSON.parse(localStorage.getItem("watchedMovies")) || []
  );
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [selectedId, setSelectedId] = useState(null);
  const debouncedQuery = useDebounce(query, 300);

  const handleSelectMovie = (id) => {
    setSelectedId((selectedId) => (id === selectedId ? null : id));
  };

  const handleCloseMovie = () => {
    setSelectedId(null);
  };

  const handleAddWatchedMovie = (movie) => {
    setWatched((watchedMovies) => [...watchedMovies, movie]);

    // add to localStorage
    // localStorage.setItem("watchedMovies", JSON.stringify([...watched, movie]));
  };

  const handleDeleteWatchedMovie = (id) => {
    setWatched((watched) => watched.filter((movie) => movie.imdbId !== id));
  };

  useEffect(() => {
    // const controller = new AbortController();

    // const fetchMovies = async () => {
    // try {
    //   setError(false);
    //   setIsLoading(true);
    //   const res = await fetch(
    //     `http://www.omdbapi.com/?apikey=${API_KEY}&s=${query}`,
    //     { signal: controller.signal }
    //   );

    //   if (!res.ok) throw new Error("Something went wrong");

    //   const data = await res.json();

    //   if (data.Response === "False") throw new Error("Movie not found");

    //   setMovies(data.Search);
    //   setError("");
    // } catch (err) {
    //   if (err.name !== "AbortError") {
    //     setError(err.message);
    //     console.log(`${err.name}: ${err.message}`);
    //   }
    // } finally {
    //   setIsLoading(false);
    // }

    // Using debouncing
    const fetchMovies = async () => {
      try {
        setError(false);
        setIsLoading(true);
        const res = await fetch(
          `http://www.omdbapi.com/?apikey=${API_KEY}&s=${query}`
        );

        if (!res.ok) throw new Error("Something went wrong");

        const data = await res.json();

        if (data.Response === "False") throw new Error("Movie not found");

        setMovies(data.Search);
        setError("");
      } catch (err) {
        if (err.name !== "AbortError") {
          setError(err.message);
          console.log(`${err.name}: ${err.message}`);
        }
      } finally {
        setIsLoading(false);
      }
    };

    if (query.length < 3) {
      setMovies([]);
      setError("");
      return;
    }

    if (debouncedQuery) {
      handleCloseMovie();
      fetchMovies();
    }

    return () => {
      // controller.abort();
      clearTimeout(fetchMovies);
    };
  }, [query, debouncedQuery]);

  useEffect(() => {
    localStorage.setItem("watchedMovies", JSON.stringify(watched));
  }, [watched]);

  return (
    <>
      <Navbar>
        <Search query={query} setQuery={setQuery} />
        <Numresults movies={movies} />
      </Navbar>
      <Main>
        <Box>
          {isLoading && <Loader />}
          {!isLoading && !error && (
            <MoviesList movies={movies} onSelectMovie={handleSelectMovie} />
          )}
          {error && <ErrorMessage message={error} />}
        </Box>
        <Box>
          {selectedId ? (
            <MovieDetails
              selectedId={selectedId}
              onCloseMovie={handleCloseMovie}
              onAddWatchedMovie={handleAddWatchedMovie}
              watched={watched}
            />
          ) : (
            <>
              <WatchedSummary watched={watched} />
              <WatchedMoviesList
                watched={watched}
                onRemoveWatchedMovie={handleDeleteWatchedMovie}
              />
            </>
          )}
        </Box>
      </Main>
    </>
  );
};

export default App;
