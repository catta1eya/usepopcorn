import { useRef } from "react";
import { useKey } from "./useKey";

const Search = ({ query, setQuery }) => {
  const inputEl = useRef(null); //in case of DOM element we usually initialize with null

  useKey("Enter", () => {
    if (document.activeElement === inputEl.current) return;
    inputEl.current.focus();
    setQuery("");
  });

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
