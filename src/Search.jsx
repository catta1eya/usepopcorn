import { useEffect, useRef } from "react";

const Search = ({ query, setQuery }) => {
  const inputEl = useRef(null); //in case of DOM element we usually initialize with null

  useEffect(() => {
    const callback = (e) => {
      if (document.activeElement === inputEl.current) return;

      if (e.code === "Enter") {
        inputEl.current.focus(); //set focus for search input on component mount
        setQuery("");
      }
    };
    document.addEventListener("keydown", callback);

    return () => document.addEventListener("keydown", callback);
  }, [setQuery]);

  // Wrong way of selecting DOM elements
  // useEffect(() => {
  //   const el = document.querySelector(".search");
  //   el.focus();

  // }, []);
  return (
    <input
      className="search"
      type="text"
      placeholder="Search movies..."
      value={query}
      onChange={(e) => setQuery(e.target.value)}
      ref={inputEl}
    />
  );
};

export default Search;
