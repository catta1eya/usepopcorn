import { useCallback, useEffect, useState } from "react";

const useDebounce = (value, delay) => {
  const [debouncedValue, setDebouncedValue] = useState(value);

  useEffect(() => {
    const handler = setTimeout(() => setDebouncedValue(value), delay);

    return () => clearTimeout(handler);
  }, [value, delay]);

  return debouncedValue;
};

const API_KEY = "d049f86f";

export const useMovies = (query) => {
  const [movies, setMovies] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const debouncedQuery = useDebounce(query, 300);

  const fetchMovies = useCallback(async () => {
    try {
      setError(false);
      setIsLoading(true);
      const res = await fetch(
        `http://www.omdbapi.com/?apikey=${API_KEY}&s=${debouncedQuery}`
      );

      if (!res.ok) throw new Error("Something went wrong");

      const data = await res.json();

      if (data.Response === "False") throw new Error("Movie not found");

      setMovies(data.Search);
    } catch (err) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  }, [debouncedQuery]);

  useEffect(() => {
    if (debouncedQuery < 3) {
      setMovies([]);
      setError(false);
      return;
    }

    if (debouncedQuery) {
      fetchMovies();
      // handleCloseMovie();
    }
  }, [debouncedQuery, fetchMovies]);

  return [movies, isLoading, error, fetchMovies];
};
